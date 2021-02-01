create TABLE file(
    uuid VARCHAR(100) NOT NULL,
    magnet VARCHAR(200) NOT NULL,
    hash_pw VARCHAR(200),
    salt VARCHAR(200),
    PRIMARY KEY (uuid)
);