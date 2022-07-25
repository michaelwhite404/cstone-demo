import axios from "axios";
import capitalize from "capitalize";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GroupModel } from "../../../../src/types/models";

export default function GroupData() {
  const [group, setGroup] = useState<GroupModel>();
  const { slug } = useParams();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/v2/groups/${slug}`);
        setGroup(res.data.data.group);
      } catch (err) {}
    };

    fetchGroup();
  }, [slug]);

  return (
    <div>
      <div>{group?.name}</div>
      <div>{group?.description}</div>
      <div>
        <div>Members</div>
        <div>
          {group?.members!.map((member) => (
            <div key={member.email}>
              {member.email} - {capitalize(member.role?.toLowerCase() || "")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
