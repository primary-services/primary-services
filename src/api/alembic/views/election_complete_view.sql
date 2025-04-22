CREATE OR REPLACE VIEW election_complete_view AS
  SELECT 
    election.id,
    election.type,
    election.municipality_id,
    election.office_id,
    election.term_id,
    election.polling_date,
    election.seat_count,
    election_joins.deadlines,
    election_joins.forms,
    election_joins.requirements
  FROM 
    election
  LEFT JOIN 
    LATERAL ( 
      SELECT 
        deadlines.list AS deadlines,
        forms.list AS forms,
        requirements.list AS requirements
      FROM ( 
        SELECT 
          jsonb_agg(deadline.*) AS list
        FROM 
          deadline
        LEFT JOIN 
          election_deadline 
        ON 
          election_deadline.deadline_id = deadline.id
        WHERE 
          election.id = election_deadline.election_id
      ) AS deadlines, ( 
        SELECT 
          jsonb_agg(form.*) AS list
        FROM 
          form
        LEFT JOIN 
          election_form 
        ON 
          election_form.form_id = form.id
        WHERE election.id = election_form.election_id
      ) AS forms, ( 
        SELECT 
          jsonb_agg(joined_requirements.*) AS list
        FROM ( 
          SELECT 
            requirement.id,
            requirement.description,
            requirement.municipality_id,
            requirement.form_id,
            requirement.deadline_id,
            requirement.label,
            to_jsonb(deadline.*) AS deadline,
            to_jsonb(form.*) AS form
          FROM requirement
          LEFT JOIN deadline ON deadline.id = requirement.deadline_id
          LEFT JOIN form ON form.id = requirement.form_id
          LEFT JOIN election_requirement ON election_requirement.requirement_id = requirement.id
          WHERE 
            election_requirement.election_id = election.id
        ) AS joined_requirements
      ) AS requirements
    ) AS election_joins ON true;