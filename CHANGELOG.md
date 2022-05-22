#### 2.0.1 (2022-05-22)

##### New Features

* **SB-170:**  support new relay modules (3999ec3b)


#### 2.0.0 (2022-05-22)

##### Build System / Dependencies

* **deps:**
  *  bump moment from 2.29.1 to 2.29.2 (3c6b707f)
  *  bump minimist from 1.2.5 to 1.2.6 (#8) (c305ed19)

##### Chores

*  temporary skip for deploy onto team vm (3e160855)
*  add build workflow on any push (a424ae71)

##### New Features

* **SB-242:**  deploy and run docker also on team vm (62a2af0f)

##### Bug Fixes

* **SB-311:**  fixed instruction status on error (0ac6806d)
* **SB-293:**  remove debug logs (938364a6)
* **SB-265:**  typescript api definition for brew state (7e478044)
* **SB-219:**  send response as json (b3e2f3ca)
* **SB-240:**  Added endpoint for shutdown (7ccef18e)
* **SB-245:**
  *  prisma docker fix (09c433b5)
  *  prisma binary targets (6df4b9ed)
  *  delete cypress (b1bc8f81)
  *  dockerfile fix rpi openssh (17725ea6)
  *  add timeout to dockerfiles (6b13ac37)
* **SB-217:**  process wait instruction (5503b8a0)
* **SB-241:**  changed seeded time for wait into ms (50fc2ee4)
* **SB-229:**
  *  functions renamed (d1abb619)
  *  fixed condition (3a4ff1d1)
  *  need to be idle to start brewing (e54f4fe4)
  *  added log info (dc3a36b6)
  *  fixed double brewing overwrite (91fe7784)
* **SB-204:**
  *  commenting not working tests (389b3f6e)
  *  moving cypress to frontend (1b95258d)
* **SB-242:**
  *  deploy team vm missing files (d6d161e1)
  *  deploy team vm docker (bf974dae)
  *  use smaller node image (730e6b13)
* **SB-239:**
  *  deploy to rpi prisma generate (34611632)
  *  seed for prisma in production v2 (803a7463)
  *  seed for prisma in production (3d51ace1)
* **SB-228:**  fixed brewing without laoded recipe (b1330804)
* **SB-224:**  fix instruction status after abort (811856cb)
* **SB-159:**
  *  wait instruction no function option (c62a68d5)
  *  initial value for instruction status (db55c1df)
* **SB-202:**  fixed wrong logging (1ba8f3b1)
* **SB-161:**  websocket chrashing on data recieve and send (109d1c66)
* **SB-160:**  tmp fix for recipe blocks (f3a8e912)

##### Other Changes

* **SB-311:**  restart brewing after error (7b9df461)
* **SB-293:**  check if required modules are connected (c794a73d)
* **SB-285:**  message if module is missing or reports error (6bc9d091)
* **SB-294:**  added finish and abort on be (87607013)
* **SB-288:**  export to csv and json (750f7cd0)
* **SB-247, SB-248, SB-255:**  brewing history enpoints (#9) (7abb7957)
* **SB-219:**  endpoint for manual testing (34842cfa)
* **SB-204:**  initial cypress setup (f06355fd)
* **SB-202:**  Partial unique index and seed refactor (a12180b3)
* **SB-188:**  Edit existing recipe and refactor (16ec46ff)
* **SB-149:**  better database error message (7b04279a)

