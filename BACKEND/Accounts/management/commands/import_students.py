# Accounts/management/commands/import_students.py

import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from Accounts.models import Students  # ← This is YOUR model

class Command(BaseCommand):
    #help is a description that shows when you run python manage.py help import_students
    help = "Import students into the database using a single command"

    def handle(self, *args, **options):
        csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "load", "students.csv")

        if not os.path.exists(csv_path):
            self.stdout.write(self.style.ERROR(f"CSV not found: {csv_path}"))
            return

        created = 0
        skipped = 0
        errors = 0

        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)

            if reader.fieldnames != ["REGNO", "FIRSTNAME", "SECONDNAME", "SURNAME"]:
                self.stdout.write(self.style.ERROR("Wrong CSV headers!"))
                return

            self.stdout.write("Importing into Students model...\n")

            for row in reader:
                reg_no = row["REGNO"].strip().replace(" ", "")
                first_name = row["FIRSTNAME"].strip()
                surname = row["SURNAME"].strip() or "TEMP123"

                # PASSWORD = SURNAME IN UPPERCASE + HASHED!
                password_hashed = make_password(surname.upper())

                try:
                    obj, was_created = Students.objects.get_or_create(
                        username=reg_no,
                        defaults={
                            "password": password_hashed,
                            "first_login": True,
                        }
                    )

                    if was_created:
                        created += 1
                        self.stdout.write(self.style.SUCCESS(f"CREATED → {reg_no} | Pass: {surname.upper()}"))
                    else:
                        # Update password if changed
                        if obj.password != password_hashed:
                            obj.password = password_hashed
                            obj.save()
                        skipped += 1

                except Exception as e:
                    errors += 1
                    self.stdout.write(self.style.ERROR(f"ERROR {reg_no}: {e}"))

        self.stdout.write(self.style.SUCCESS("\n" + "═" * 60))
        self.stdout.write(self.style.SUCCESS("IMPORT SUCCESSFUL!"))
        self.stdout.write(f"   Created : {created}")
        self.stdout.write(f"   Existed : {skipped}")
        self.stdout.write(f"   Errors  : {errors}")
        self.stdout.write(self.style.SUCCESS("\nLogin Details:"))
        self.stdout.write(self.style.SUCCESS("   Username → REGNO"))
        self.stdout.write(self.style.SUCCESS("   Password → SURNAME in UPPERCASE"))
        self.stdout.write(self.style.SUCCESS("   Example: 30554/T.2023 → NDEKUPE"))