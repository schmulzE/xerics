import { X } from "react-feather";

export default function Chip(props) {
  const { item, removeLabel } = props;
  return (
    <label className="badge" style={{ backgroundColor: item.color, color: "#fff" }}>
      {item.text}
      {removeLabel && <X onClick={() => removeLabel(item)} />}
    </label>
  );
}