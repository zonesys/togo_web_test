import React, { useEffect } from 'react';

const TestComponent = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.lahza.io/inline.min.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const pay = () => {}

    const handleSubmit = (event) => {
        event.preventDefault();
        pay();
    };

    return (
        <div className='d-flex justify-content-center p-5' style={{ backgroundColor: "silver" }}>
            <form id="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" required />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input type="text" id="amount" required />
                </div>
                <br />
                <div className="form-submit">
                    <button type="submit">Pay</button>
                </div>
            </form>
        </div>
    );
};

export default TestComponent;