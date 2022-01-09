# Spark Admin

The Spark Admin is responsible for the higher-level functions of [Spark](https://github.com/robvanbakel/spark), that cannot be executed by the app on the frontend. At this moment, the Admin serves these purposes:

## Routes: /
| Route              | Method | Parameters            | Description                                                  |
| :----------------- | :----- | :-------------------- | :----------------------------------------------------------- |
| `/feed`            | GET    | uid                   | Finds all shifts for the provided user and returns iCal feed |

## Routes: /admin

| Route              | Method | Parameters            | Description                                                  |
| :----------------- | :----- | :-------------------- | :----------------------------------------------------------- |
| `/createNewUser`   | POST   | email                 | Creates a new user in Firebase and returns the uid           |
| `/getSchedules`    | GET    | uid                   | Gets all schedules for a single employee                     |
| `/getUser`         | GET    | uid                   | Gets user data for a single employee                         |
| `/activateAccount` | GET    | token, email          | Verifies activation token by email address                   |
| `/activateAccount` | POST   | token, email, password | Sets new password for user and sets status to 'active'       |

## Functions

| Function          | Description                                                         |
| :---------------- | :------------------------------------------------------------------ |
| `shiftDatabase()` | Shift all demo content by a week every Monday at midnight           |
| `getSettings()`   | Serve settings form database, store settings in memory for one hour |

#### Built With

- [Express](http://expressjs.com)
- [Firebase Admin SDK](https://firebase.google.com/docs/reference/admin)

## Other repositories

- [robvanbakel/spark](https://github.com/robvanbakel/spark)
- [robvanbakel/spark-website](https://github.com/robvanbakel/spark-website)
