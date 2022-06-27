import { ShortUrlModel } from "../../../../src/types/models";
import QRCode from "../../components/QRCode";
import TableWrapper from "../../components/TableWrapper";
import "./ShortLinksTable.sass";

const headers = ["Full URL", "Short Link", "Clicks", "QR Clicks", "QR Code"];

export default function ShortLinksTable({ links }: { links: ShortUrlModel[] }) {
  const getClickableLink = (link: string) => {
    return link.startsWith("http://") || link.startsWith("https://") ? link : `http://${link}`;
  };
  return (
    <TableWrapper>
      <table className="short-link-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link._id}>
              <td>
                <a href={getClickableLink(link.full)} target="_blank" rel="noreferrer">
                  {link.full}
                </a>
              </td>
              <td>
                <a href={`http://cstonedc.org/${link.short}`} target="_blank" rel="noreferrer">
                  cstonedc.org/{link.short}
                </a>
              </td>
              <td>{link.clicks}</td>
              <td>{link.qr_clicks}</td>
              <td>
                <QRCode size={40} value={`cstonedc.org/${link.short}?refer_method=qr`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
