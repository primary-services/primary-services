import {
  useMunicipalityHistory,
} from "../api-hooks.js";
import { convertKeyToLabel } from "../utils.js";

const labelMap = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
};

const tidyItemType = (item_type) => {
  const lowerCase = item_type.toLowerCase();
  // De-pluralize simple plurals
  if (item_type === "seats") return "seat";
  if (item_type === "terms") return "term";
  return lowerCase;
};

const getHistoryChangePropertyUpdate = (key, val, changeIdx) => {
  // Handle arrays of changes -- each entry is an object with action and fields
  // If multiple identical changes exist, aggregate them with a count
  if (Array.isArray(val)) {
    const aggregatedArray = val.reduce((acc, curr) => {
        const existing = acc.find(item => {
            const {count, ...rest} = item;
            return JSON.stringify(rest) === JSON.stringify(curr) ? item : null;
        });
        if (existing) {
            existing.count = existing.count + 1;
        } else {
            acc.push({...curr, count: 1});
        }
        return acc
    }, []);

    return (
        <div className="history-changes">
          {aggregatedArray.map(v => getHistoryChanges(v, key))}
        </div>
    )
  }

  // Handle object -- similar to array case, except no need to iterate
  if (typeof val === 'object' && val !== null) {
    return (
      <div className="history-changes">
        {getHistoryChanges(val, key)}
      </div>
    )
  }

  // Base case: simple property update
  return (
    <div key={changeIdx} className="history-update">
      {convertKeyToLabel(key)}: {val ? val.toString() : "null"}
    </div>
  );
};

const getHistoryChanges = (entry, item_type) => {
  const { action, fields, count } = entry;
  return (
    <div className="history-changes">
        <div className="history-changes-action">
            <strong>{labelMap[action]} {tidyItemType(item_type)}</strong>
            {!!fields.humanReadableIdentifier ? ` "${fields.humanReadableIdentifier}"` : ''} 
            {!!count && count > 1 ? ` (x${count})` : ''}
        </div>
        <div className="history-changes-properties">
            {Object.entries(fields)
              .filter(([key, _]) => key !== "humanReadableIdentifier")
              .sort(([_, val1], [__, val2]) => val1.toString().length - val2.toString().length)
              .map(([key, val], changeIdx) => (
                getHistoryChangePropertyUpdate(key, val, changeIdx)
            ))}
        </div>
    </div>
  );
};

export const MunicipalityHistory = ({ close, municipality }) => {
    const { data: history = [] } = useMunicipalityHistory(municipality?.id);
    return <div className="municipality-history">
        <p className="disclaimer">Records not available for changes before X/X/X</p>
        {
            history.length === 0 ? <h4>No history available.</h4> : history.map((entry, idx) => (
                <div key={idx} className="history-entry">
                    <p className="history-date">{new Date(entry.created_at).toLocaleString()}</p>
                    <p className="history-user">{entry.user?.email || 'Unknown User'}</p>
                    <div className="history-diff">
                      {getHistoryChanges(entry.fields, entry.item_type)}
                    </div>
                </div>
            ))
        }
    </div>;
}