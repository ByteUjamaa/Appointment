import gspread
from django.shortcuts import render, HttpResponse
from oauth2client.service_account import ServiceAccountCredentials
from django.contrib.auth.hashers import make_password
from .models import Students

# Create your views here.
def home(request):
    return HttpResponse('hellow world')

def load_student():
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive"
    ]

    creds= ServiceAccountCredentials.from_json_keyfile_name(
        "student_import.json", scope
    )
    client = gspread.authorize(creds)

    sheet = client.open_by_key("1Po9OC9tZAerK1syuGPN4TPKTLxYiSeGA").sheet1

    rows = sheet.get_all_records()

    for row in rows:
        reg_no = row["REGNO"]
        surname = row["SURNAME"].upper()

        Students.objects.get_or_create(
                username=reg_no,
                defaults={"password": make_password(surname)}
            )

    print("Imported successfully!")