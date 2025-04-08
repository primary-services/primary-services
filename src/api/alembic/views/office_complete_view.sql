CREATE OR REPLACE VIEW office_complete_view AS
  SELECT 
    o.id,
    o.title,
    o.description,
    o.elected,
    o.tenure,
    o.salary,
    o.min_hours,
    o.max_hours,
    o.municipality_id,
    terms.list AS terms
  FROM 
    office o
  LEFT JOIN LATERAL ( 
    SELECT 
      jsonb_agg(joined_term.*) AS list
    FROM ( 
      SELECT 
        term.id,
        term.start,
        term."end",
        term.office_id,
        to_jsonb(e.*) AS election
      FROM 
        term
      LEFT JOIN LATERAL ( 
        SELECT 
          ev.id,
          ev.type,
          ev.municipality_id,
          ev.office_id,
          ev.term_id,
          ev.polling_date,
          ev.seat_count,
          ev.deadlines,
          ev.forms,
          ev.requirements
        FROM 
          election_complete_view AS ev
        WHERE 
          ev.term_id = term.id
      ) AS e ON true
    ) AS joined_term
  ) AS terms ON true;