from django.core.management.base import BaseCommand

from landing.models import Review

REVIEWS = [
    ("Joseph Mwangi", 5, "The ground conditions were worse than the original report suggested. SKK re-sequenced the earthworks in two days and still hit the slab date. That flexibility saved the whole programme."),
    ("Amina Kariuki", 5, "We used them first for the survey and setting out, then kept extending the scope. By the end they were running the drainage and the roads too. Never had to chase a coordination issue."),
    ("Daniel Ochieng", 4, "Their cabro finish is the tidiest we have had on any of our yards. Levels are right, the falls work, and two rainy seasons later there is no settlement at the edges."),
    ("Priya Nair", 5, "Weekly progress reports arrived every Friday without fail, with photographs and the actual quantities. As a client that is worth more than a discount."),
    ("Samuel Baraka", 5, "The soil investigation flagged a soft layer our consultant had missed. Redesigning the footings cost us three weeks; ignoring it would have cost us the building."),
    ("Grace Wanjiru", 4, "Site was kept clean and the neighbours were kept informed. On a residential street that matters as much as the concrete does."),
    ("Peter Kamau", 5, "Mobilised within a week of signing and never lost a day to plant breakdowns. That kind of reliability is rare on earthworks packages."),
    ("Fatuma Hassan", 3, "The finished road is solid, though the programme slipped by two weeks after a redesign on our side. SKK absorbed the change without a dispute."),
    ("Brian Otieno", 5, "Setting out was spot on down to the millimetre. Every subcontractor after them built off marks they never had to question."),
    ("Naomi Chebet", 4, "Good communication throughout the drainage works. A couple of snags at handover, but they came back the same week to close them out."),
    ("Kevin Mutua", 5, "We handed them a brownfield site with legacy foundations nobody had records for. They surveyed it, replanned around it, and kept the programme intact."),
    ("Esther Njeri", 5, "Their safety briefings are the most thorough we have seen on any of our sites. Zero incidents across an eight-month programme."),
    ("Ali Abdi", 4, "The soil testing report was detailed enough that our structural engineer barely had questions. Saved us a second site visit."),
    ("Caroline Wambui", 5, "Landscaping and external works tied the whole development together. Planting beds, retaining walls and paving all handed over in one clean sweep."),
    ("Dennis Kiprop", 3, "Decent civil works overall. Drainage falls needed a revisit after the first heavy rains, but they fixed it promptly and at no extra cost."),
    ("Winnie Auma", 5, "From feasibility through to construction, one team held the whole project. No handover gaps, no finger-pointing between contractors."),
    ("Moses Langat", 4, "Road formation and surfacing were completed ahead of the rains, which mattered more to us than anything else on the programme."),
    ("Sarah Wanjala", 5, "Their project manager caught a clash between the drainage design and a neighbouring boundary wall before it became a real problem."),
    ("Victor Omondi", 4, "Plant was always on site when scheduled. The only contractor we have used who never asked us to wait on a hire company."),
    ("Lucy Nyambura", 5, "Excavation and bulk earthworks on a tight urban site, with zero complaints from the neighbours. That is a harder job than it sounds."),
]


class Command(BaseCommand):
    help = "Seed the Review table with sample testimonials for the index page."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete existing reviews before seeding fresh ones.",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            deleted, _ = Review.objects.all().delete()
            self.stdout.write(f"Deleted {deleted} existing review(s).")
        elif Review.objects.exists():
            self.stdout.write("Reviews already exist, skipping seed. Use --flush to reseed.")
            return

        Review.objects.bulk_create(
            Review(name=name, rating=rating, description=description)
            for name, rating, description in REVIEWS
        )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(REVIEWS)} reviews."))
