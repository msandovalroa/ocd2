# On Cloud Diagnostics 2 - OCD 2

### Requirements
* PHP 5+
* JS
* MySQL
* Smarty
* JQuery
* XAMPP env.

### Description:
This system pulls all the data broadcasted from a device plugged in into any vehicle (i.e. taxi floats, school buses, corporate vehicles, etc), to a centralized database. From this data source, we extract all the information related to each car like fuel consumption, location, incidents, and general activity. Once the information has been received, we use this system to display an overview of the entire float. Creating charts to display consumption, tables to track certain data (like trips and/or incidents) and the real-time location (if available) in a google maps interface.

With OCD2 we tried to simplify the information to allow the users to understand it in a friendly and clear interface.

### Images

![9dcda1c5-f138-4496-8473-03b9e070455a](https://user-images.githubusercontent.com/74633512/199817766-4430ce3c-6963-41e2-8351-870851a945dc.png)
![b5335f89-8470-4e82-94a8-e2c366bac8ca](https://user-images.githubusercontent.com/74633512/199817775-891d404c-dd1a-43bc-9282-cccc79f4c194.png)
[image.pdf](https://github.com/msandovalroa/ocd2/files/9932443/image.pdf)


### Instalation

1. Install the DB and confirm is working in a localhost environment
2. Download smarty engine and locate it into the xampp files (/htdocs)
3. Install the files into the root of the xampp files
4. Configure the credentials for the apis (Google Maps)
5. Make sure the dependencies are well directioned: on header, make sure the routes are correct (like C:/ for Windows or Applications/ for Mac OS)
6. Open browser and run localhost:
