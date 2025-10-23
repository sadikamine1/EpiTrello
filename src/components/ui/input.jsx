import * as React from "react";

function Input({ className = "", ...props }) {
  return (
    <input
      className={"bg-gray-700 text-white p-2 rounded outline-none border border-zinc-600 " + className}
      {...props}
    />
  );
}

export { Input };
