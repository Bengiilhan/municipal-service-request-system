#  Municipal Service Request System / Belediye Hizmet Talep Sistemi

This is a full-stack municipal issue tracking system where citizens can report local problems and track resolution status through an interactive map. Built with Django and React.This system is tailored for the İzmir Metropolitan Municipality and is designed to collect and manage citizen requests within İzmir city boundaries. The map and location features are restricted to İzmir.

Bu uygulama, vatandaşların belediye hizmetlerine yönelik taleplerini iletebildiği ve taleplerin durumlarını harita üzerinden takip edebildiği modern bir şikayet sistemidir. Django ve React ile geliştirilmiştir.
Bu sistem, İzmir Büyükşehir Belediyesi’nin hizmet alanındaki vatandaş taleplerini almak ve izlemek amacıyla geliştirilmiştir. Harita ve konum sınırlandırmaları İzmir ili ile sınırlıdır.
---

## Features / Özellikler

*  **Service Request Submission**
  Citizens can submit complaints with title, description, location and multimedia (photo, video).
  Vatandaşlar başlık, açıklama, konum ve görsel/video içeren şikayet formları oluşturabilir.

*  **Interactive Map**
  All complaints are shown on a map for geographic context.
  Şikayetler harita üzerinde işaretlenerek görüntülenir.

*  **Request Tracking**
  Citizens can track their own and others' complaints along with status (pending, in progress, resolved).
  Vatandaşlar kendi ve diğer şikayetleri ile güncel durumlarını (beklemede, işlemde, tamamlandı) görebilir.

*  **Admin Dashboard**
  Admins can manage and update requests via a separate panel with filtering and map view.
  Yetkililer harita ve filtre destekli özel admin panelinden talepleri yönetebilir.

*  **JWT Authentication**
  Secure login and access with token-based authentication.
  Token tabanlı güvenli kullanıcı giriş ve erişim sistemi (JWT).

---

## Technologies 

**Backend:**

* Django 5.2
* Django REST Framework
* PostgreSQL
* JWT (djangorestframework-simplejwt)
* python-decouple (for secure configs)

**Frontend:**

* React
* Axios
* Leaflet (for interactive map)

---

##  Installation 

### ⚙ Backend (Django)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python manage.py runserver
```

###  Frontend (React)

```bash
cd frontend
npm install
npm start
```

> Make sure PostgreSQL and `.env` variables are set up.

---

##  Environment Variables

Example `.env` file:

```env
DB_NAME=municipal_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

SECRET_KEY=your_django_secret
```

## Roadmap 

* [x] Citizen request form
* [x] Media (image/video) support
* [x] Admin dashboard
* [x] Role-based access
* [ ] Real-time update (WebSocket support)
* [ ] Email/SMS alerts

---

## Developer 

Developed by **Bengi İlhan** as part of a municipal citizen engagement project.

---

##  Contact 

* GitHub: [bengiilhan](https://github.com/bengiilhan)
* Mail: [bengiilhan2003@gmail.com](mailto:your@email.com)

---

##  License / Lisans

This project is open source and freely available.
Bu proje açık kaynaklıdır ve özgürce kullanılabilir.
