import json
import os
import pkgutil
from . import utils
# We're not using pyyaml, just showing that it's installed
import yaml
print("Loading function")
def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    print("value1 = " + event["key1"])
    print("value2 = " + event["key2"])
    print("value3 = " + event["key3"])
    print(utils.my_util())
    print(f"cwd: {os.getcwd()}")
    lines = pkgutil.get_data(__name__, "my_lambda/stuff/config.yml")
    print("File contents of my_lambda/stuff/config.yml:")
    print(lines)
    return event["key1"]  # Return the first key value


"""
{
	id: null,
	title: "",
	description: "",
	salary: 0,
	commitment_min: 0,
	commitment_max: 0,
	terms: [
		{
			id: null,
			start: null,
			end: null,
			incumbents: [],
			election: {
				polling_date: null,
				seat_count: 1,
				candidates: [],
				deadlines: [
					{
						id: null,
						label: "",
						description: "",
						deadline: null,
					}
				],
				requirements: [
					{
						id: null,
						label: "",
						description: "",
						form: null,
						deadline: null,
					}
				],
				forms: [
					{
						id: null,
						label: "",
						description: "",
						url: "",
					}
				],
				notes: [],
			}
		}
	]
}
"""

"""
ploymorhpic table




req_id | obj_id | obj_type
