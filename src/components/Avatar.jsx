import { useState } from "react";

export default function Avatar({ linkPhoto, onSubmitBtn, onChangeBtn}) {
  const [changeBtnShow, setChangeBtnShow] = useState(false);



  return (
    <div className="flex flex-col items-center">
      {/* photo  */}
      <div className="mb-6 border w-32 h-32 rounded-full">
        <img className="rounded-full w-32 h-32" src={linkPhoto} alt="avatar" />
      </div>

      <button
        className="px-2 py-1 text-sm
  rounded-full shadow-md
  bg-orange-300
  hover:bg-orange-400 hover:shadow-lg
  focus:bg-orange-400 focus:shadow-lg
  transition duration-150 ease-in-out
  cursor-pointer"
        type="button"
        onClick={() => setChangeBtnShow(!changeBtnShow)}
      >
        {changeBtnShow ? "Cancel" : "Change photo"}
      </button>

      {changeBtnShow && (
        <form
          className="mt-6 flex flex-col w-[90%]
      border-t pt-6"
          onSubmit={onSubmitBtn}
        >
          <div>
            <input
              className={`mb-6 text-xs
      text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-xs file:font-semibold
      file:bg-orange-50 file:text-orange-700
      hover:file:bg-orange-100
      `}
              type="file"
              onChange={onChangeBtn}
              accept=".jpg, .png, .jpeg"
            />
          </div>


            <button
              className="px-2 py-1 text-sm
  rounded-full shadow-md
  cursor-pointer
  bg-orange-100
  hover:bg-orange-200 hover:shadow-lg
  focus:bg-orange-200 focus:shadow-lg
  transition duration-150 ease-in-out"
              type="submit"
            >
              Submit
            </button>
        </form>
      )}

    </div>
  );
}
