import {
  useMunicipalityHistory,
} from "../api-hooks.js";
import { convertKeyToLabel } from "../utils.js";

const labelMap = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
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
                    <div className="history-changes">
                        <div className="history-create">
                            <strong>{labelMap[entry.fields.action]} {entry.item_type.toLowerCase()}</strong>
                        </div>
                        {Object.entries(entry.fields.fields).map(([key, val], changeIdx) => (
                            <div key={changeIdx} className="history-update">
                                <strong>{convertKeyToLabel(key)}:</strong> {val.toString()}
                            </div>
                        ))}
                    </div>
                </div>
            ))
        }
        <section className="actions">
          <div className="btn blocky clicky" onClick={close}>
            Close
          </div>
		</section>
    </div>;
}