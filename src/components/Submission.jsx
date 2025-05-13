import React from 'react';

const submission = [
    {
        status: 'Accepted',
        time_complexity: '1.2s',
        language: 'Python',
        submisssion_date: new Date()
    },
    {
        status: 'wrong answer',
        time_complexity: '1.9s',
        language: 'javascript',
        submisssion_date: new Date()
    },
    {
        status: 'compilation error',
        time_complexity: '0.9s',
        language: 'C++',
        submisssion_date: new Date()
    },
    {
        status: 'Accepted',
        time_complexity: '1.1s',
        language: 'Java',
        submisssion_date: new Date()
    },
];

function Submission() {
    return (
        <div className="container mx-auto p-4 overflow-auto max-h-[80vh]" style={{scrollbarColor: '#4B5563 #1F2937',scrollbarWidth: 'thin'}}>
            <div className="overflow-x-auto ">
                <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-900 text-gray-400 text-left">
                            {submission.length > 0 &&
                                Object.keys(submission[0]).map((key, index) => (
                                    <th key={index} className="px-4 py-2 border border-gray-300 capitalize">
                                        {key.replace('_', ' ')}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {submission.map((data, index) => (
                            <tr key={index} className="border border-gray-300 odd:bg-white even:bg-gray-100">
                                {Object.values(data).map((value, i) => (
                                    <td key={i} className="px-4 py-2 border border-gray-300 bg-gray-900">
                                        {value instanceof Date ? value.toLocaleString() : value==='Accepted' ? <span className="text-green-500">{value} </span> : value==='wrong answer' || value==='compilation error' || value==='run time error'  ? <span className="text-red-600">{value}</span> : <span className="text-gray-300">{value}</span>}  
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Submission;