### Scrape Town List

`cd scripts`
`node get-towns.js`

### Terraform Setup (Mac)

`brew tap hashicorp/tap`
`brew install hashicorp/tap/terraform`

### AWS setup

1. Get terraform.tfvars from other dev and & put in `/environments/dev/node-api`
2. Setup AWS creds

    1. Get token & secret from other dev
    2. `vi ~/.aws/credentials` (you may need to `mkdir ~/.aws` first if it fails)
    3. c/p the following into `~/.aws/credentials` & replace 'token' and 'secret' with the real values

    ```
    [elections]
    aws_access_key_id = token
    aws_secret_access_key = secret
    ```
    
4. Confirm it works by running `terraform plan` 

### Services
- [Admin Front End](#admin-front-end)
- [Candidate Front End](#candidate-front-end)
- [Node API](#node-api)     

### Admin Front End
**Installation And Running**
``cd /src/admin``
``npm install``
``npm run start``

**Deployment**
``cd /src/admin``
``npm run build``
``cd /environments/dev/admin-website``
Run ``terraform plan``, and make sure the changes look right
If they do ``terraform apply``

### Candidate Front End
**Installation And Running**
``cd /src/website``
``npm install``
``npm run dev``

**Deployment**
``cd /src/website``
``npm run build``
``cd /environments/dev/website``
Run ``terraform plan``, and make sure the changes look right
If they do ``terraform apply``

### Node Api
**Installation And Running**
``cd /src/node-api``
``npm install``
Get the DB Creds from another dev, and make a local copy of the DB
Copy the ``.env.example`` file to ``.env`` and fill in your local variables
Run ``npm run dev`` and the server should be started

**DB Migrations** 
- ``npx sequelize-cli migration:generate --name migration-example``
- Then run ``npm run migration`` and copy the output to the migration file created above
- Check it over, as that migration generator is still in development
- When your confident the changes are accurate run ``npx sequelize-cli db:migrate --url={your_db_url}``

**Deployment**
``cd /environments/dev/node-api``
Run ``terraform plan``, and make sure the changes look right
If they do ``terraform apply``