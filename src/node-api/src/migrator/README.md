You can ignore this, but it's actually pretty handy. It checks the models against the 
database and generates a list of create/updates/deletes representing the difference
between the database and the models. It's a work in progress

What is does so far

- compares table columns for
	- added/removed columns
	- changes to the datatype
	- changes to nullable
	- changes to default values

- what's planned
	- actually generating the file

- known issues
	- renamed columns will appear as a create/delete column
	- through table relations aren't getting read right

To use
	- in the node-api root run `npm run migrations`
	- The output will be the changes to add to a migration file