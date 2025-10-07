import React from 'react';

function SubmitButton({ handleSubmit, isPending }) {
  return (
    <div className="flex justify-end mt-4 p-6">
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Voucher"}
      </button>
    </div>
  );
}

export default SubmitButton;
