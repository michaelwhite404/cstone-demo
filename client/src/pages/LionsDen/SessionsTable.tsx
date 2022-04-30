import Badge from "../../components/Badge/Badge";
import TableWrapper from "../../components/TableWrapper";
import "./SessionsTable.sass";

interface SignedOutEntry {
  _id: string;
  student: {
    _id: string;
    fullName: string;
    email: string;
  };
  session: string;
  dropIn: boolean;
  lateSignOut: boolean;
  signOutDate: string;
  signature: string;
}

export default function SessionsTable({ entries }: { entries: SignedOutEntry[] }) {
  return (
    <TableWrapper>
      <table className="aftercare-session-table">
        <thead>
          <tr>
            <th>Student</th>
            <th className="hide-at-640">Time</th>
            <th style={{ width: 150 }}>Signature</th>
            <th className="hide-at-640" style={{ width: 150 }}></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr style={{ borderBottom: "1px #e5e7eb solid" }} key={entry._id}>
              <td>
                <div>{entry.student.fullName}</div>
                <div className="show-at-640">
                  <div
                    style={{
                      color: "gray",
                      fontSize: 10,
                      margin: "7px 0",
                    }}
                  >
                    Time: {new Date(entry.signOutDate).toLocaleTimeString()}
                  </div>
                  {entry.lateSignOut && <Badge text="Late" color="red" />}
                </div>
              </td>
              <td className="hide-at-640">{new Date(entry.signOutDate).toLocaleTimeString()}</td>
              <td>
                <img
                  className="sign-out-signature"
                  src={`/images/${entry.signature}`}
                  alt="signature"
                />
              </td>
              <td className="hide-at-640 late-td">
                {entry.lateSignOut && <Badge text="Late" color="red" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
