You can ignore this, it's my own little project that I shouldn't be wasting time on
but I love auto-migrations so... working on it. 

What is does so far

*Big Warning renamed columns will be treated as removed and dropped, and I'm not sure how to fix that*

- compares table columns for
	- added/removed columns
	- changes to the datatype
	- changes to nullable
	- changes to default values

- what's planned
	- constraint checks
		- added/removed/updated
		- actually generating the file


To use
	- Add `"type": "module"` to the package.json file (can't figure out how to get rid of this)
	- in the node-api root run `node ./src/migrator/migrator.js`
	- The output will be the changes to add to a migration file