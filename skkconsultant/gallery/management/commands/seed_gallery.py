import urllib.request

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from gallery.models import BeforeAfter, Category, Image

USER_AGENT = "Mozilla/5.0 (compatible; skkconsultant-seed-gallery/1.0)"

CATEGORY_IMAGES = {
    "Building construction": [
        "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=800&q=70",
    ],
    "Real estate": [
        "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=70",
    ],
    "Excavation": [
        "https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1583024011792-b165975b52f5?auto=format&fit=crop&w=800&q=70",
    ],
    "Cabro & paving": [
        "https://images.unsplash.com/photo-1610477865545-37711c53144d?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1529792083865-d23889753466?auto=format&fit=crop&w=800&q=70",
    ],
    "Road construction": [
        "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1591486085897-f433f05e7aed?auto=format&fit=crop&w=800&q=70",
    ],
    "Surveying": [
        "https://images.unsplash.com/photo-1581094488379-6a10d04c0f04?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1693019108329-1889fb170f2e?auto=format&fit=crop&w=800&q=70",
    ],
    "Civil engineering": [
        "https://images.unsplash.com/photo-1642927778267-4e8b787b325a?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1534097575056-ddba81f714c8?auto=format&fit=crop&w=800&q=70",
    ],
    "Landscaping": [
        "https://images.unsplash.com/photo-1649807479468-40011b31ee09?auto=format&fit=crop&w=800&q=70",
        "https://images.unsplash.com/photo-1628645419184-26a1f2757340?auto=format&fit=crop&w=800&q=70",
    ],
}

BEFORE_AFTER = [
    (
        "Road construction",
        "https://images.unsplash.com/photo-1652303713917-2666b8bee507?auto=format&fit=crop&w=900&q=70",
        "https://images.unsplash.com/photo-1507415710579-79b32edf8a78?auto=format&fit=crop&w=900&q=70",
    ),
    (
        "Cabro & paving",
        "https://images.unsplash.com/photo-1622082679766-c5912d9416eb?auto=format&fit=crop&w=900&q=70",
        "https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?auto=format&fit=crop&w=900&q=70",
    ),
]


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


class Command(BaseCommand):
    help = "Seed Category, Image and BeforeAfter rows with placeholder photos for local testing."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing categories/images/before-afters before seeding fresh ones.",
        )

    def handle(self, *args, **options):
        seed_names = list(CATEGORY_IMAGES)

        if options["flush"]:
            deleted, _ = BeforeAfter.objects.filter(category__name__in=seed_names).delete()
            self.stdout.write(f"Deleted {deleted} existing before/after row(s).")
            deleted, _ = Image.objects.filter(category__name__in=seed_names).delete()
            self.stdout.write(f"Deleted {deleted} existing image(s).")
            deleted, _ = Category.objects.filter(name__in=seed_names).delete()
            self.stdout.write(f"Deleted {deleted} existing categor(y/ies).")
        elif Category.objects.filter(name__in=seed_names).exists():
            self.stdout.write("Seed categories already exist, skipping seed. Use --flush to reseed.")
            return

        categories = {}
        for name in CATEGORY_IMAGES:
            categories[name] = Category.objects.get_or_create(name=name)[0]

        image_count = 0
        for name, urls in CATEGORY_IMAGES.items():
            category = categories[name]
            for index, url in enumerate(urls, start=1):
                data = fetch(url)
                image = Image(category=category)
                image.image.save(f"{category.slug}-{index}.jpg", ContentFile(data), save=True)
                image_count += 1
                self.stdout.write(f"Saved image {image_count} for {name}")

        ba_count = 0
        for name, before_url, after_url in BEFORE_AFTER:
            category = categories[name]
            before_data = fetch(before_url)
            after_data = fetch(after_url)
            ba = BeforeAfter(category=category)
            ba.image_before.save(f"{category.slug}-before.jpg", ContentFile(before_data), save=False)
            ba.image_after.save(f"{category.slug}-after.jpg", ContentFile(after_data), save=False)
            ba.save()
            ba_count += 1
            self.stdout.write(f"Saved before/after pair for {name}")

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(categories)} categories, {image_count} images and {ba_count} before/after pairs."
        ))
