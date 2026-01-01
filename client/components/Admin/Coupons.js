import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiTrash, BiPowerOff } from 'react-icons/bi';
import { FiPower } from 'react-icons/fi';

const defaultFormState = {
    code: '',
    type: 'fixed',
    value: '',
    minOrderTotal: '',
    maxDiscount: '',
    usageLimit: '',
    description: '',
    expiresAt: ''
};

const Coupons = ({ tab }) => {
    const [ coupons, setCoupons ] = useState([]);
    const [ form, setForm ] = useState(defaultFormState);
    const [ feedback, setFeedback ] = useState('');
    const [ feedbackType, setFeedbackType ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const loadCoupons = () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/coupons`).then((res) => {
            setCoupons(res.data || []);
            setFeedback('');
            setFeedbackType('');
        }).catch(() => {
            setFeedback('שגיאה בטעינת הקופונים');
            setFeedbackType('error');
        });
    };

    useEffect(() => {
        if (tab === 'coupons') {
            loadCoupons();
        }
    }, [ tab ]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const normalizedValue = name === 'code' ? value.toUpperCase() : value;
        setForm((prev) => ({ ...prev, [name]: normalizedValue }));
    };

    const resetForm = () => {
        setForm(defaultFormState);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.code || !form.value) {
            setFeedback('אנא מלא/י קוד וערך הנחה');
            setFeedbackType('error');
            return;
        }

        setIsSubmitting(true);
        setFeedback('');
        setFeedbackType('');

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, form).then((res) => {
            setCoupons((prev) => [ res.data, ...prev ]);
            resetForm();
            setFeedback('קופון נוסף בהצלחה');
            setFeedbackType('success');
        }).catch((error) => {
            setFeedback(error?.response?.data?.message || 'שגיאה בשמירת הקופון');
            setFeedbackType('error');
        }).finally(() => setIsSubmitting(false));
    };

    const toggleCouponActive = (couponId, active) => {
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${ couponId }`, { active: !active }).then((res) => {
            setCoupons((prev) => prev.map((coupon) => coupon._id === couponId ? res.data : coupon));
            setFeedback('');
            setFeedbackType('');
        }).catch(() => {
            setFeedback('שגיאה בעדכון הקופון');
            setFeedbackType('error');
        });
    };

    const deleteCoupon = (couponId) => {
        if (prompt('הזן סיסמא') !== '123123') {
            return;
        }

        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${ couponId }`).then(() => {
            setCoupons((prev) => prev.filter((coupon) => coupon._id !== couponId));
            setFeedback('');
            setFeedbackType('');
        }).catch(() => {
            setFeedback('שגיאה במחיקת הקופון');
            setFeedbackType('error');
        });
    };

    const formatDate = (value) => {
        if (!value) {
            return 'ללא תוקף';
        }

        return new Date(value).toLocaleDateString('he-IL');
    };

    return (
        <div>
            <form id="new-coupon-form" onSubmit={ handleSubmit }>
                <h3>הוסף קופון חדש</h3>
                <div className="form-grid">
                    <input type="text" name="code" placeholder="קוד" value={ form.code } onChange={ handleInputChange } />
                    <select name="type" value={ form.type } onChange={ handleInputChange }>
                        <option value="fixed">₪</option>
                        <option value="percentage">%</option>
                    </select>
                    <input type="number" name="value" placeholder="ערך" value={ form.value } onChange={ handleInputChange } />
                    <input type="number" name="minOrderTotal" placeholder="מינימום הזמנה" value={ form.minOrderTotal } onChange={ handleInputChange } />
                    <input type="number" name="maxDiscount" placeholder="הנחה מקסימלית" value={ form.maxDiscount } onChange={ handleInputChange } />
                    <input type="number" name="usageLimit" placeholder="מכסת שימושים" value={ form.usageLimit } onChange={ handleInputChange } />
                    <input type="date" name="expiresAt" placeholder="תאריך תפוגה" value={ form.expiresAt } onChange={ handleInputChange } />
                </div>
                <div className="form-row">
                    <textarea name="description" placeholder="תיאור (אופציונלי)" value={ form.description } onChange={ handleInputChange } />
                </div>
                <div className="form-row form-row-actions">
                    <input type="submit" value={ isSubmitting ? 'שומר...' : 'הוסף' } disabled={ isSubmitting } />
                </div>
                { feedback && <p className={ `form-feedback ${ feedbackType }` }>{ feedback }</p> }
            </form>

            <div id="coupons-list">
                { coupons.map((coupon) => (
                    <div className="coupon-list-item" key={ coupon._id }>
                        <div className="coupon-list-header">
                            <div className="coupon-code">{ coupon.code }</div>
                            <div className={ `coupon-status ${ coupon.active ? 'active' : 'inactive' }` }>{ coupon.active ? 'פעיל' : 'לא פעיל' }</div>
                        </div>
                        <div className="coupon-meta-inline">
                            <span>סוג הנחה: { coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}₪` }</span>
                            <span>מינימום הזמנה: { coupon.minOrderTotal ? `${coupon.minOrderTotal}₪` : 'ללא' }</span>
                            { coupon.maxDiscount ? <span>הנחה מקסימלית: { coupon.maxDiscount }₪</span> : null }
                        </div>
                        <div className="coupon-meta-inline">
                            <span>{ coupon.usageLimit ? `שימושים: ${(coupon.usageCount || 0)} / ${coupon.usageLimit}` : `שימושים שבוצעו: ${coupon.usageCount || 0}` }</span>
                            <span>תוקף: { formatDate(coupon.expiresAt) }</span>
                        </div>
                        { coupon.description && <div className="coupon-description">תיאור: { coupon.description }</div> }

                        <div className="coupon-actions">
                            <button type="button" onClick={ () => toggleCouponActive(coupon._id, coupon.active) }>
                                { coupon.active ? <BiPowerOff/> : <FiPower/> }
                                <span>{ coupon.active ? 'השבתה' : 'הפעלה' }</span>
                            </button>
                            <button type="button" className="delete" onClick={ () => deleteCoupon(coupon._id) }>
                                <BiTrash/>
                                <span>מחיקה</span>
                            </button>
                        </div>
                    </div>
                )) }

                { !coupons.length && <p>אין קופונים להצגה.</p> }
            </div>
        </div>
    );
};

export default Coupons;
