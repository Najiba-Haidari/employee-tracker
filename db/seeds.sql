INSERT INTO department (name)
VALUES  ("Management"),
        ("Marketing"),
        ("Finance"),
        ("Procurement"),
        ("ICT");

INSERT INTO role (title, salary, department_id)
VALUES  ("General Manager", 200000, 1),
        ("Executive Manager", 170000, 1),
        ("Marketing Manager", 110000, 2),
        ("Marketing Associate", 80000, 2),
        ("Finance Officer", 100000, 3),
        ("Finance Assistant", 70000, 3),
        ("Procurement Officer", 90000, 4),
        ("Procurement Assistant", 80000, 4),
        ("IT Manager", 110000, 5),
        ("IT Assistant", 80000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Mohammad", "Mirzaei", 1, NULL ),
        ("Tom", "Blue", 2, 1),
        ("Liane", "Williams", 3, NULL),
        ("Paul", "Derekes", 4, 3),
        ("David", "Sharifi", 5, NULL),
        ("Manja", "Shafa", 6, 5),
        ("Brad", "Wick", 7, NULL),
        ("Rose", "Wayne", 8, 7),
        ("Najiba", "Haidari", 9, NULL),
        ("William", "White", 10, 9);