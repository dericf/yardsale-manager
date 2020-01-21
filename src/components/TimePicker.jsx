import React from 'react'
import DatePicker from 'react-datepicker'


const TimePicker = ({ value, handleChange, name, ...rest }) => {
    return (
        <DatePicker
            className="timepicker"
            selected={value}
            onChange={
                value => {
                    handleChange(value)
                }
            }
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            todayButton={true}
            showMonthDropdown
            showYearDropdown
            dateFormat="MMMM d, yyyy h:mm aa"
        />
    )
}

export default TimePicker