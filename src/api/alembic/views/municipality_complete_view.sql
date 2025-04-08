CREATE OR REPLACE VIEW municipality_complete_view AS
  SELECT 
    m.id,
    m.name,
    m.type,
    m.parent_id,
    m.website,
    o.list AS offices,
    of.list AS officials,
    municipal_joins.deadlines,
    municipal_joins.forms,
    municipal_joins.requirements
  FROM 
    municipality AS m
  LEFT JOIN LATERAL ( 
    SELECT 
      jsonb_agg(ov.*) AS list
    FROM 
      office_complete_view ov
    WHERE 
      ov.municipality_id = m.id
  ) AS o ON true
  LEFT JOIN LATERAL (
    SELECT 
      JSONB_AGG(officials.*) AS list
    FROM (
      SELECT 
        off.*,
        TO_JSONB(office.*) AS office
      FROM 
        official AS off
      LEFT JOIN 
        office
      ON 
        office.id = off.office_id 
      WHERE 
        off.municipality_id = m.id
    ) AS officials
  ) AS of ON true
  LEFT JOIN LATERAL ( 
    SELECT 
      deadlines.list AS deadlines,
      forms.list AS forms,
      requirements.list AS requirements
    FROM ( 
      SELECT 
        jsonb_agg(deadline.*) AS list
      FROM 
        deadline
      WHERE 
        deadline.municipality_id = m.id
    ) AS deadlines, ( 
      SELECT 
        jsonb_agg(form.*) AS list
      FROM 
        form
      WHERE 
        form.municipality_id = m.id
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
        FROM 
          requirement
        LEFT JOIN 
          deadline 
        ON 
          deadline.id = requirement.deadline_id
        LEFT JOIN 
          form 
        ON 
          form.id = requirement.form_id
        WHERE 
          requirement.municipality_id = m.id
      ) AS joined_requirements
    ) AS requirements
  ) AS municipal_joins ON true;