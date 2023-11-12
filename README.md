# RESTAURANT RESERVATION API

## ENDPOINTS

## USERS:
### POST CREATE USER url:3000/users

example body

```
{
    "userName": "juan",
    "firstName": "juan",
    "lastName": "bustamante",
    "email": "jpbusta@gmail.com",
    "dni": "434525",
    "role": "res_admin",
    "password": "pass"
}
````
role can be res_admin or client

return statement:
```
{
    "message": "created",
    "id": "7e817f01-8fa5-47f3-976c-45c41737646e"
}
```

### GET USERS url:3000/users

no body needed returns array of users\
returns:
```
[
    {
        "id": "7e817f01-8fa5-47f3-976c-45c41737646e",
        "userName": "edu",
        "firstName": "eduardo",
        "lastName": "bustamante",
        "email": "edu@gmail.com",
        "dni": "67676",
        "reservations": [],
        "favourites": [],
        "role": "res_admin"
    },
    ...
]
```
### GET USERS BY EMAIL url:3000/email

body: 
```
{
    "email": "example@gamil.com",
    "password": "example"
}
```
returns: the user object:

```
{
    "_id": "34381815-e091-46a0-bbac-45f18c873fda",
    "_userName": "juan",
    "_firstName": "juan",
    "_lastName": "bustamante",
    "_email": "jpbusta@gmail.com",
    "_dni": "434525",
    "_reservations": [],
    "_favourites": [],
    "_role": "res_admin"
}
```

## RESTAURANTS:

# create restaurant

POST url:3000/restaurants

body example: 
```
{
    "name": "banderita",
    "adress": "Leandro N. Alem 3926",
    "manager_id": "07de8db4-6cdd-4867-af05-4d9f737102bc"
}
```
returns:
```
{
    "message": "created",
    "id": "7e817f01-8fa5-47f3-976c-45c41737646e"
}
```
# get rstaurants
GET url:3000/restaurants

returns:
```
[
    {
        "id": "e230a1d2-6c0d-46a0-9409-b6333578212c",
        "name": "Don Alejo Parrilla",
        "adress": "Constitucion 5000"
    },
    {
        "id": "a1a70999-1a01-44c1-b191-08e1ce24b9e5",
        "name": "Manolo Centro",
        "adress": "Santa 1900"
    }
]
```

# get by id 

GET restaurants/id

body:
```
{
    "id": "a1a70999-1a01-44c1-b191-08e1ce24b9e5"
}
```
returns 
```
{
    "id": "a1a70999-1a01-44c1-b191-08e1ce24b9e5",
    "name": "Manolo Centro",
    "adress": "Santa 1900",
    "manager_id": "136de781-f906-489f-8a90-615e7feddcea"
}
```

# get by name

GET restaurants/name/:name

example restaurants/name/Manolo Centro

returns 
```
{
    "id": "a1a70999-1a01-44c1-b191-08e1ce24b9e5",
    "name": "Manolo Centro",
    "adress": "Santa 1900",
    "manager_id": "136de781-f906-489f-8a90-615e7feddcea"
}
```

# CREATE TABLE

POST /restaurants/table

body:

```
{
    "tableNumber": 1,
    "capacity": 4,
    "restaurant_id":"4b47e89c-dada-4987-8f5e-ff2fb7503dc2"
}
```
returns 
```
{
    "message": "created",
    "id": "7e817f01-8fa5-47f3-976c-45c41737646e"
}
```

# get tables by restaurant

GET /restaurants/tables

body:
```
{
    "restaurant_id: "4b47e89c-dada-4987-8f5e-ff2fb7503dc2"
}
```
returns
```
[
    {
        "id": "ca8a489b-0ace-4ac2-8a69-145ea7f05064",
        "number": 1,
        "capacity": 4
    }
]
```
# add categorie
POST /restaurants/create/categorie
body: 
```
 {
        "categorie": "parrilla",
        "restaurant_id": "4a9bb4bb-bb53-464c-9d6d-430b41ed1356"
 }
```
returns:
if added correctly:
```
{
    "message": "categorie already added"
}
```
# get categories by id:
GET /restaurants/categories/:id
returns an array of strings with the name of the categories:


## RESERVATIONS

# create reservation
POST /reservations/create


body example:  (states can be: confirmed, toConfirm, cancelled)

```
{
    "user_id": "ebe089b5-f5e5-4032-9225-339afdf00615",
    "restaurant_id": "4b47e89c-dada-4987-8f5e-ff2fb7503dc2",
    "state": "toConfirm",
    "res_size": 4,
    "due_date": "2023-11-27",
    "res_date": "2023-11-02"
}
```
returns:
```
{
    "message": "created",
    "id": "7e817f01-8fa5-47f3-976c-45c41737646e"
}
```


# get reservations by id 
GET reservations/get/:id
example reservations/get/7e817f01-8fa5-47f3-976c-45c41737646e




