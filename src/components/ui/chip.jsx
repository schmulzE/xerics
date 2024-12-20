export default function Chip(props) {
  const { item, removeLabel } = props;

  const customBackgroundColor = `rgba(${parseInt(item?.color.slice(-6, -4), 16)}, ${parseInt(item?.color.slice(-4, -2), 16)}, ${parseInt(item?.color.slice(-2), 16)}, 0.2)`; // Convert hexadecimal color to RGBA with 0.5 opacity

  return (
    <label className="badge rounded-sm" style={{ backgroundColor: customBackgroundColor, color: item?.color}}>
      <span className="text-sm uppercase">{item?.text}</span>
      {removeLabel && <i className="pi pi-times text-sm mx-1 cursor-pointer" onClick={() => removeLabel(item)} />}
    </label>
  );
}