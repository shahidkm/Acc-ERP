// DatePickerSection.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setDate } from "../../../../../redux/slices/voucher";
import DatePicker from '../../../common/DatePicker';

function DatePickerSection({ voucher }) {
    const dispatch = useDispatch();

    const handleDateChange = (dateObj, formattedDate) => {
        dispatch(setDate(formattedDate));
    };

    return (
        <div className='w-72'>
            <DatePicker
                selectedDate={voucher.date ? new Date(voucher.date) : new Date()}
                onDateChange={handleDateChange}
                format="YYYY-MM-DD"
                title="Select Date"
                className="mb-4"
            />
        </div>
    );
}

export default DatePickerSection;