interface PartyMemberProps {
  name: string;
  image: string;
  role?: string;
}

export const PartyMember = ({ name, image, role }: PartyMemberProps) => {
  return (
    <div className="text-center w-full max-w-[140px]">
      <div className="w-[140px] h-[140px] rounded-full overflow-hidden mb-2.5 shadow-md">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h4 className="my-2 font-['Cormorant_Garamond'] text-lg">{name}</h4>
      {role && <p className="text-xs text-gray-600 m-0">{role}</p>}
    </div>
  );
};

export default PartyMember;
