

module.exports = {
    'aws': {
        'key': process.env.access_key,
        'secret': process.env.secret_access_key,
        'ses': {
            'from': {
                // replace with an actual email address
                'default': '"oscsnz@gmail.com" <oscsnz@gmail.com>', 
            },
            // e.g. us-west-2
            'region': 'us-east-2' 
        }
    }
};