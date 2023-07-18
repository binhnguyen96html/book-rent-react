export default function DropDown({ optionList,id,value,onChange }) {
  return (
    <div>
      <select
        className="mt-1 mr-2 py-2 px-10 bg-white  shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md 
          sm:text-sm focus:ring-1"
          value={value}
          id={id}
          onChange={onChange}
          required
      >
        {optionList.map((option, index) => (
          <option 
          key={index}
          value={option.value}
          >{option.title}</option>
        ))}
      </select>
    </div>
  );
}
