# University Consultation Appointment System

This project is a **web-based Consultation Appointment System** designed for universities and higher learning institutions. The system enables students to request consultation appointments with their lecturers, track their project progress, view appointment reports, and interact more efficiently without relying on paperwork.

Lecturers can manage appointments, conduct consultations physically or remotely (via video conferencing), and monitor student progress throughout their academic or project work.

The system is built with:

* **Frontend:** React
* **Backend:** Django (Django REST Framework)



## Key Features

### User & Access Management

* Secure login for Students and Lecturers
* Profile update & role-based access
* Only registered university students/lecturers can use the system

### Appointment Management

* Students request consultation appointments
* Lecturers accept, decline, or reschedule appointments
* Appointment calendar + status tracking
* Appointment history & detailed reports

### Student Progress Tracking

* Students can view their overall project progress
* Lecturers can update progress reports
* Progress timeline & documentation

### Video Consultation Support

* Lecturers can choose to conduct physical or online consultations
* Integration with tools like Jitsi/Zoom (future enhancement)

### Notifications

* email notifications for appointment updates and reminders

### Additional Features

* Search & filter appointments
* Admin tools for managing users and roles
* Clean, modern, responsive UI (React)



##  Folder Structure

### Root Directory

```
consultation-system/
├── README.md
├── LICENSE
├── .gitignore
├── frontend/                 # React Application
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.js
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── styles/
│       └── utils/
└── backend/                  # Django Application
    ├── manage.py
    ├── requirements.txt
    ├── backend_project/
    │   ├── settings.py
    │   └── urls.py
    ├── apps/
    │   ├── accounts/         # Authentication, profiles
    │   └── appointments/     # Appointment logic
    ├── static/
    ├── templates/
    ├── Dockerfile
    └── docker-compose.yml
```



##  Installation & Setup

### Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```




Run migrations:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Build for production:

```bash
npm run build
```






##  Git Workflow (Important for All Developers)

To avoid conflicts and maintain a clean development environment, follow these rules:

###  **Always pull before you start working**

```bash
git checkout dev
git pull origin dev
```

### **Never push directly to `master`**

`master` = production
`dev` = development


###  **Write clean, smart code + good commit messages**

Use Conventional Commits:

```
feat: add student appointment request page
fix: resolve appointment time overlap issue
docs: update README
```




###  **Avoid Conflicts**

* Pull frequently
* Make small commits
* Do not rewrite other people’s code unnecessarily
* Communicate before doing large updates





## Security Recommendations

* Never commit `.env` or secrets
* Use HTTPS in production
* Enforce permissions on all API endpoints
* Validate inputs to prevent attacks
* Use rate limiting for login endpoints



##  Future Enhancements

* Mobile App (React Native)
* SMS reminders
* Google/Outlook Calendar sync
* Department-level analytics dashboards
* More detailed reporting tools




