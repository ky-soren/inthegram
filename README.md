# In The Gram
My attempt at cloning Instagram. Supports user creation, image upload, comments, and captions! In exchange for "liking" functionality, I have set up a data store at S3 to handle higher volumes of file uploads. S3 returns a file link which is stored as a Charfield in the database. File hashing is implented by hashlib and S3 functionality is implemented through boto3. Requests are handled through Axios that makes GET and POST requests to the API's implemented by Django Rest Framework's APIView.

### Requirements
To install neccessary packages run 
``` pip install -r requirements.txt ```

In the views.py file commented line 74 must be configured to your S3-bucket.
On commented line 79 of the same file, you must configure "your-url-here" to fit to your url as given by AWS.

After configuring the User, Access Key ID, and Secret Access Key for AWS S3, you can then run the server with ```python manage.py runserver```

[More options and information on configuring AWS can be found here](https://boto3.readthedocs.io/en/latest/guide/quickstart.html#installation)

### Limits
Currently, the app only supports images in .JPG and .JPEG format. Enjoy!
