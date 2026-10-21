import logoImage from "../../assets/favicon.svg";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img
        className="size-10 shrink-0 object-contain"
        src={logoImage}
        alt="Logo Image"
      />
      <span className="font-heading whitespace-nowrap text-xl font-bold tracking-tight text-heading">
        usePopcorn
      </span>
    </div>
  );
}

export default Logo;
