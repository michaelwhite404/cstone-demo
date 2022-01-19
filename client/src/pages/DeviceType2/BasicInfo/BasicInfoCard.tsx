interface CardDataProps {
  heading: string;
  value?: string;
  showSkeleton?: boolean;
}

export default function BasicInfoCard({ data }: { data: CardDataProps }) {
  return (
    <div className="basic-info-card">
      <div className="basic-info-card-heading">{data.heading}</div>
      <div className="basic-info-card-value">{data.value}</div>
    </div>
  );
}
