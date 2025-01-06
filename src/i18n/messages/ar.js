import { LOCALES_TYPES } from '../locales';

export default {
    [LOCALES_TYPES.ARABIC]: {

        PRINT_ALL :{
            "NO_ORDERS":"لا يوجد طرود",
            "ERROR_OCCURRED":"حدث خطأ، يرجى اعادة تحميل الصفحة",
            "PRINT_ALL":"طباعة الكل"
        },
        WITHDRAW_REQUEST: {
            "CANCEL_REQUEST": "إلغاء طلب السحب",
            "REQUEST_DATE": "تاريخ الطلب",
            "REQUEST_TIME": "وقت الطلب",
            "WITHDRAWAL_AMOUNT": "مبلغ السحب",
            "STATUS": "الحالة",
            "REQUEST_WITHDRAWAL": "إرسال طلب سحب",
            "REQUEST_WITHDRAW": "إرسال طلب سحب",
            "CONFIRMATION":"هل تريد عمل طلب سحب بهذا المبلغ ؟",
            "AMOUNT": "المبلغ",
            "CANCEL": "إلغاء",
            "SEND_REQUEST": "إرسال الطلب",
            "NO_REQUESTS": "لا يوجد طلبات سحب",
            "WAITING": "بالإنتظار",
            "FINISHED": "منتهي",
            "REJECTED": "مرفوض",
            "CANCELED": "ملغي",
        },
        CREATE_NEW_ORDER: {
            "NAME": "الإسم",
            "ADDRESS": "العنوان",
            "MOBILE_NUMBER": "رقم الجوال",
            "RECEIVER_NAME_EXISTS":"اسم المستلم موجود مسبقا ، يمكنك الاختيار من قائمة العناوين المستخدمة" ,
            "RECEIVER_PHONE_EXISTS":"رقم هاتف المستلم موجود مسبقا ، يمكنك الاختيار من قائمة العناوين المستخدمة" ,
            "CHANGE_PICKUP_ADDRESS": "تغيير عنوان التحميل",
            "SET_DEFAULT_ADDRESS": "إختر عنوان التحميل الإفتراضي من قائمة العناوين الخاصة بك",
            "SELECT": "إختيار",
            "SET_DEFAULT": "تعيين",
            "DEFAULT_ADDRESS": "العنوان الإفتراضي",
            "SET_NEW_ADDRESS": "إنشاء عنوان تسليم جديد",
            "OR_CHOOSE_FROM_LIST": "أو إختر من القائمة",
            "CHANGE_FROM_LIST": "تغيير العنوان من قائمتي",
            "CHOOSE_DELIVERY_ADDRESS": "إختر عنوان التسليم",
            "SELECT_DELIVERY_ADDRESS_FROM_LIST": "إختر عنوان التسليم من قائمة العناوين",
            "PLEASE_ADD_PLACE_NAME": "الرجاء إدخال إسم المستقبل",
            "PLEASE_ENTER_VALID_NUMBER": "الرجاء إدخال رقم هاتف صحيح ، مثال 0568000000",
            "PROVINCE": "الإقليم",
            "GOVERNORATE": "المحافظة",
            "CITY": "المدينة",
            "AREA": "المنطقة",
            "SELECT_PROVINCE": "إختر الإقليم",
            "SELECT_GOVERNORATE": "إختر المحافظة",
            "SELECT_CITY": "إختر المدينة",
            "SELECT_AREA": "إختر المنطقة",
            "OPTIONAL": "إختياري",
            "ADDRESS_INFO": "معلومات إضافية",
            "ATTACHMENTS_LABEL": "معلومات إضافية عن الطرد",
            "NOTES": "ملاحظات",
            "SUBMIT_ORDER": "نشر الطلب",
            "CREATE_ORDER": "إنشاء طلب جديد",
            "ORDER_INFO": "معلومات الطلب",
            "SELECT_DELIVERY_TYPE": "إختر طريقة التوصيل",
            "REQUIRED_ERROR": "بعض الحقول مطلوبة!",
            "SET_FOR_NOW": "تعيين فقط لهذه المرة",
            "SEARCH_CUSTOMER": "الزبون",
            "ENTER_COD": "السعر",
            "PREP_TIME": "وقت التحضير",
            "CUSTOMER_PHONE": "رقم الزبون",
            "WENT_WRONG": "هناك خطأ ما",
            "CUSTOMER_NAME": "الإسم",
            "CUSTOMER_PHONE": "رقم الهاتف",
            "CUSTOMER_AREA": "المنطقة",
            "SELECT": "إختيار",
            "DESELECT": "إلغاء التحديد",
            "ADD_NEW_CUSTOMER": "إضافة زبون جديد",
            "CANCEL": "إلغاء",
            "DESCRIPTION": "الوصف",
        },
        TEMP: {
            "TEMP_NAME": "temp Name",
            "TEMP_DATA": "temp data",
            "LOCATION": "الموقع",
            "LOAD_INFO": "Load Information",
            "SENDER_INFO": "Sender Information",
            "RECEIVER_INFO": "Receiver Information",
            "VIEW_LOCATION": "View Location",
            "SENDER_LOCATION": "Sender Location",
            "DELIVERY_PROCESS": "Delivery Process",
            "CURRENT_TRANSPORTER": "Current Transporter",
            "TRANSPORTATION_PROCESS_HOSTORY": "Transportation Process History",
            "LOAD_COST": "Load Cost",
            "TRANSPORTER_DETAILS": "transporter Details",
            "TRANSPORTATION_PROCESS": "Transportation Process",
            "NET_AMOUNT":"المبلغ الاجمالي",
            "DELIVERY_COST": "ثمن التوصيل",
            "CLIENT_MOBILE_NUMBER": "رقم هاتف الزبون",
            "INFO": "التفاصيل",
            "ACCEPT_OFFER": "قبول العرض",
            "ACCEPT": "قبول",
            "REJECT": "رفض",
            "NO_MEMBERS": "لا يوجد أعضاء!",
            "PLZ_ENTER_MOBILE": "أدخل رقم هاتف الناقل الذي تود إضافته",
            "ADD_TRANSPORTER": "إضافة ناقل",
            "NAME": "الإسم",
            "PHONE": "رقم الهاتف",
            "ADD_MEMBER": "إضافة عضو",
            "JOIN_NETWORK": "الإنضمام إالى شبكة",
            "ORDERED_BY": "من",
            "ORDER": "الطلب",
            "ORDER_TRANSACTIONS": "معاملات الطلب",
            "ASSIGN_TO": "تعيين إلى",
            "SELECT_FIRST": "تأكد من تحديد الطلبات أولاً!",
            "SELECT_MEMBER": "إختيار عضو",
            "MEMBER_SEARCH": "للبحث أدخل الإسم أو رقم الهاتف",
            "SELECT_ALL": "تعيين الكل",
            "ASSIGN": "تعيين",
            "TO_ALL_MEMBERS": "تعيين لجميع أعضاء الشبكة",
            "ORDER_ACTIONS": "الحركات",
            "ASSIGNED_AND_WAITING": "في إنتظار الموافقة",
            "ASSIGNED_TO_ME": "تم تعيين الطلب لي",
            "ASSIGNED_AND_ACCEPTED": "تمت الموافقة على الطلب",
            "ASSIGNED_AND_REJECTED": "تم رفض الطلب",
            "CANCEL_ASSIGN": "إالغاء التعيين",
            "SUBMIT_AND_ASSIGN": "تأكيد الطلب وتحويله لشبكتي",
            "STUCK": "طلب عالق",
            "RETURN": "إرجاع الطلب",
            "SUBMIT": "إرسال",
            "DESC": "الوصف",
            "SURE_TO_RETURN": "هل أنت متأكد من إرجاع الطلب؟",
            "ACCEPT_RETURN": "موافقة إرجاع الطلب",
            "REJECT_RETURN": "رفض إرجاع الطلب",
            "ACCEPT_ORDER": "قبول الطلب",
            "REJECT_ORDER": "رفض الطالب",
            "SURE_TO_ACCEPT_RETURN": "هل أنت متأكد من تأكيد إرجاع الطلب؟",
            "SURE_TO_REJECT_RETURN": "هل أنت متأكد من رفض إرجاع الطلب؟",
            "SURE_TO_ACCEPT_ORDER": "هل أنت متأكد من قبول الطلب؟",
            "SURE_TO_REJECT_ORDER": "هل أنت متأكد من رفض الطلب؟",
            "CANCEL_ASSIGNED_ORDER": "إلغاء التعيين",
            "SURE_TO_CANCEL_ORDER": "هل أنت متأكد من إلغاء التعيين؟",
            "YES": "نعم",
            "OK":"حسنا",
            "NO": "لا",
            "SELECT_GOV": "إختر المحافظة",
            "FROM": "من",
            "TO": "إلى",
            "PRICE": "السعر",
            "HEIGHT": "الإرتفاع",
            "WIDTH": "العرض",
            "LENGTH": "الطول",
            "WEIGHT": "الوزن",
            "NOTES": "ملاحظات",
            "PROVINCE": "الإقليم",
            "GOVERNORATE": "المحافظة",
            "CITY": "المدينة",
            "AREA": "المنطقة",
            "CHOOSE_FROM_NETWORK": "إختيار ناقل من شبكتي",
            "MY_CLIENTS": "عملائي",
            "ORDER_INFO": "معلومات الطلب",
            "SUCCISSFULLY_PUBLISHED": "تم نشر الطلب بنجاح",
            "SUCCISSFULLY_PUBLISHED_CLIENT": "تم نشر الطلب بنجاح ، بإمكانك تعيين الطلب لناقل من شبكتك",
            "NETWORK_OFFERS": "شبكتي والعروض المتاحة",
            "MY_NETWORK": "شبكتي",
            "SELECT_DELIVERY_TYPE": "إختر طريقة التوصيل",
            "MANAGE_TEAMS": "إدارة فرقي",
            "NO_BALANCE": "غير متوفر",
            "NAME_MOBILE": "الإسم/الهاتف",
            "ACTIVE": "نشط",
            "WATING": "بالإنتظار",
            "STATUS": "الحالة",
            "FULL_NAME": "الإسم الكامل",
            "BUSINESS_NAME": "الإسم التجاري",
            "AUTO_OFFER": "عرض تلقائي",
            "AUTO_ACCEPT": "قبول تلقائي",
            "AUTO_OFFER_DESC": "تفعيل هذه الخاصية سوف يقوم بعمل عروض تلقائية على طلبات هذا العميل",
            "AUTO_ACCEPT_DESC": "تفعيل هذه الخاصية سوف يقوم بقبول التعيينات من هذا الناقل بشكل مباشر",
            "SEND_INVITATION": "إرسال دعوة",
            "INVITATION_SENT": "تم إرسال دعوة",
            "ACCEPT_INVITATION": "قبول الدعوة",
            "SURE_TO_FINISH_RETURNED": "هل أنت متأكد من تأكيد إنهاء الطلب المرتجع؟",
        },
        TRANSACTIONS: {
            "ORDER_ID": "رقم الطلب",
            "DATE": "التاريخ",
            "NAME": "الإسم",
            "TIME": "الوقت",
            "JOURNAL_NAME": "الوصف",
            "AMOUNT": "المقدار",
            "IN": "مُخرَج",
            "OUT": "مُدخَل",
        },
        GENERAL: {
            "ORDERS":"الطلبات",
            "ERROR": "خطأ",
            "COULD_NOT_FETCH": "جلب البيانات لم يكتمل",
            "ERROR_FETCHING": "حدث خطأ في جلب البيانات",
            "CLOSE": "إغلاق",
            "CANCEL": "إلغاء",
            "PROCEED": "استكمال",
            "DELETE": "حذف",
            "SUCCESS": "نجاح العملية",
            "EDIT": "تعديل",
            "CONFIRM": "تأكيد",
            "BLOCKED": "هذا الحساب محظور!",
        },
        ACCOUNT_DETAILS: {
            "PERSONAL_INFORMATION": "المعلومات الشخصية",
            "BUSINESS_LOCATION": "أماكن العمل",
            "VEHICLE_INFORMATION": "معلومات المركبة",
            "WORKING_TIME": "أوقات العمل",
            "BUSINESS_INFO": "Business Information",
            "OP_AREAS": "مناطق العمل",
        },
        PERSONAL_DETAILS: {
            "ISSUING_IDENTITY": "مكان إصدار الهوية",
            "ID_NUMBER": "رقم الهوية",
            "DRIVER_NUM": "رقم رخصة القيادة",
            "ACCOUNT_NAME": "إسم الحساب",
            "FULL_NAME": "الإسم الكامل",
            "EMAIL": "الايميل",
            "BUSINESS_NAME": "الإسم التجاري"
        },
        VEHICLES_INFORMATION: {
            "VEHICLE_NUMBER": "رقم المركبة",
            "VEHICLE_TYPE": "نوع المركبة",
        },
        WORKING_TIME: {
            "FROM": "من",
            "TO": "الى",
            "DAY": "الليوم",
            "SATURDAY": "السبت",
            "SUNDAY": "الأحد",
            "MONDAY": "الإثنين",
            "TUESDAY": "الثلاثاء",
            "WEDNESDAY": "الأربعاء",
            "THURSDAY": "الخميس",
            "FRIDAY": "الجمعة",
            "UPDATE": "تحديث"
        },
        HEADER: {
            "BACK": "رجوع",
            "ACCOUNT_PROFILE": "معلومات الحساب",
            "PAYMENT_INFO": "معلومات الدفع",
            "LOGOUT": "تسجيل خروج",
            "CHOOSE_LANGUAGE": "إختار لغة",
            "HOME": "الرئيسية",
            "CITIES_PRICES": "الأسعار بين المدن",
            "TOTAL_ORDERS": "إجمالي الطلبات",
            "REQUEST_WITHDRAWAL": "طلب سحب",
            "MANAGE_CLIENTS": "إدارة العملاء",
            "MANAGE_SUBUSERS": "إدارة الحسابات الفرعية",
        },
        WALLET: {
            "BALANCE": "الرصيد",
            "CURRENT_BALANCE":"الرصيد الحالي",
            "ERROR_WITHDRAW":"انت تحاول سحب مبلغ اكبر من الموجود في حسابك ٫ قد يكون هنالك طرود يجب عليك اختيارها من القائمة ٬ يرجي اعادة الاختيار بعناية"
        },
        ORDERS: {
            
            "NEW_ORDERS": "الطلبات الجديدة",
            "IN_PROCESS_ORDER": "الطلبات قيد التنفيذ",
            "COMPLETED_OR_CANCELED_ORDER": "الطلبات الملغيلة و المنجزة",
            "FINANCIAL_TRANSACTIONS": "المعاملات المالية",
            "INVOICES": "فواتير العميل",
            "ORDER_NUM": "رقم الطلب",
            "FOREIGN_NUM" : "Foreign Order Number",
            "FOREIGN_BARCODE" : "My reference",
            "DELIVERY_TYPE": "طريقة التوصيل",
            "PACKAGE_TYPE": "نوع الطرد",
            "ORDER_DATE": "تاريخ الطلب",
            "FINISH_DATE": "تاريخ الانهاء",
            "ORDER_TIME": "وقت الطلب",
            "FROM_CITY": "من",
            "TO_CITY": "الى",
            "PRICE": "السعر",
            "FULL_DETAILS": "كامل المعلومات",
            "ORDER_STATUS": "حالة الطلب",
            "SHOW": "إظهار",
            "COMPLETED": "مكتمل",
            "CANCELED": "ملغي",
            "ERR_FINALIZE_ORDER": "خطأ في إستكمال الطلب",
            "SUCCESS_FINALIZE_ORDER": "تم إستكمال الطلب بنجاح",
            "NO_ORDERS_FOUND": "لا يوجد طلبات",
            "DELIVERY": "توصيل فقط",
            "COD": "الدفع عند الاستلام",
            "PREPAID": "الدفع قبل الاستلام",
            "PICKUP": "تحميل",
            "PAP": "تحميل ودفع",
            "FOOD": "طعام",
            "SMALL_PACKAGE_AND_ENVELOPS": "طرد صغير ومغلفات",
            "SMALL_PACKAGE":"طرد صغير",
            "MEDIUM_PACKAGE": "طرد وسط",
            "LARGE_PACKAGE": "طرد كبير",
            "EXTRA_LARGE_PACKAGE":"طرد كبير جدا",
            "CREATE_ORDER": "اضف طلب جديد",
            "WHAT_TO_TRANS": "ما الذي ترغب في توصيله ؟ ",
            "PICKUP_ADDRESS": "عنوان التحميل",
            "SUBMIT": "تنفيذ",
            "DELIVER_TO": "توصيل الى",
            "ATTACHMENTS_LABEL": "معلومات الطرد ومرفقاته",
            "DIMENSIONS_LABEL": "ابعاد الطرد والوزن",
            "SELECT_ADDRESS": "اختر عنوان",
            "ADD_ADDRESS": "اضف عنوان",
            "ADDRESS_NAME": "الاسم",
            "ADDRESS_PHONE": "رقم الهاتف",
            "ADDRESS_CITY": "اختار مدينة",
            "ADDRESS": "العنوان",
            "ADDRESS_INFO": "معلومات اضافيه عن العنوان",
            "ADDRESS_COUNTRY": "بلد",
            "ADDRESS_CODE": "رمز بريدي",
            "ADDRESS_SHARED": "اجعل هذا العنوان متاحًا للمستخدمين الآخرين",
            "ADDRESS_SEARCH": "للبحث اكتب اسم العنوان او رقم الهاتف",
            "AMOUNT": "المبلغ",
            "NO_OFFERS": "لا يوجد عروض",
            "AVAILABLE_OFFERS": "العروض المتاحة",
            "SELECT_CLIENT": "اختيار الزبون",
            "NEW_CUSTOMER_ORDER": "إنشاء طلب زبون",
            "BIDS_COUNT": "العروض",
            "ASSIGN": "تعيين",
            "CREATE_NEW_ORDER": "إنشاء طلب جديد",
            "SUBMIT_ORDER": "إنشاء الطلب",
            "CHOOSE_TRANS": "إختر ناقل",
            "CLIENT_NAME": "إسم الزبون",
            "RECEIVER_NAME": "إسم المستقبل",
            "TO_CITY_NAME": "إلى المدينة",
            "DELIVERY_COST": "سعر التوصيل",
            "REVIEWED": "تم مراجعته",
            "REVIEWED_ORDER": "تم مراجعتها",
            "EDIT_COD": "تعديل قيمة الطرد",
            "EDIT_NOTES": "تعديل الملاحظات",
            "SAVE": "حفظ",
        },
        INVOICES: {
            "SENDER": "المرسل",
            "ORDER_ID": "رقم الطلب",
            "TRANS_VAL": "قيمة التحويل",
            "TOGO_COMM": "خصم الشركة",
            "TAX": "الضريبة",
            "TOTAL": "المجموعة",
        },
        ORDER_DETAILS: {
            "ORDER_NUMBER": "رقم الطلب",
            "DELIVERY_TYPE": "طريقة التوصيل",
            "PACKAGE_TYPE": "نوع الطرد",
            "PACKAGE_TYPE_WARNING":"ملاحظة: رسوم التوصيل قابلة للتغيير من قبل شركة التوصيل بناءً على حجم الطرد.",
            "LOAD_HEIGHT": "ارتفاع الحمل",
            "LOAD_WIDTH": "عرض الحمل",
            "LOAD_LENGTH": "طول الحمل",
            "LOAD_WEIGHT": "وزن الحمل",
            "LOAD_DETAILS": "معلومات الحمل",
            "UP_TO":"الى حد",
            "BIGGER_THAN":"أكبر من",
            "CM":"سم",
            "HEIGHT_NOT_LARGER":"يجب ألا يكون الارتفاع أكبر من",
            "WIDTH_NOT_LARGER":"يجب ألا يكون العرض أكبر من",
            "LENGTH_NOT_LARGER":"يجب ألا يكون الطول أكبر من",
            "ILS":"شيكل",
            "JOD":"دينار",
            "SENDER_ADDRESS": "عنوان المرسل",
            "RECEIVER_ADDRESS": "عنوان المستقبل",
            "BID_PRICE": "عمولة التحويل",
            "FULL_DETAILS": "تفاصيل كاملة",
            "ACCEPT_ORDER": "قبول الطلب",
            "MAKE_A_BID": "تحديد تكلفة الرحلة",
            "WILL_TAKEN_CHARGE": "سوف تؤخذ بدل رسوم",
            "FINALIZE_ORDER": "إنهاء الطلب",
            "VERIFICATION_CODE": "الرجاء إدخال رمز التحقق",
            "CANCEL_ORDER": "إلغاء الطلب",
            "CONFIRM_CANCEL": "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟",
            "EDIT_TRANS_FEES": "تعديل رسوم التحويل",
            "SET_TRANS_FEES": "تحديد رسوم التحويل",
            "DEL_TRANS_FEES": "حذف رسوم التحويل",
            "ORDER": "طلب",
            "CONFIRM_DELETE_FEES": "هل أنت متأكد أنك تريد حذف رسوم التحويل لهذا الطلب؟",
            "CITY": "المدينة",
            "VILLAGE": "القرية",
            "NEIGHBORHOOD": "الحي",
            "STREET": "الشارع",
            "BUILDING_NAME": "اسم المبنى",
            "FLOOR": "الطابق",
            "APART_NUM": "رقم الشقة",
            "OTHER_DETAILS": "تفاصيل أخرى",
            "PHONE_NUMBER": "رقم الهاتف",
            "PRINT": "اطبع",
            "STICKER":"ملصق",
            "BID": "Bid",
            "ORDER_DETAILS": "تفاصيل الطلب",
            "MY_PRICE": "سعري",
            "PRICE": "سعر التوصيل",
            "PICKUP_DATE": "وقت التحميل",
            "STUCK_COMMENT": "ملاحظة الطلب العالق",
            "ACCEPT_RETURNED": "موافقة إرجاع الطلب",
            "REJECT_RETURNED": "رفض إرجاع الطلب",
            "ORDER_MARKED_RETURNED": "بإنتظار موافقة طلب الإرجاع",
            "ORDER_STUCK": "الطلب عالق",
            "ORDER_RETURNED": "أعيد الطلب للمرسل",
            "ORDER_RETURNING": "الطلب قيد الإرجاع",
            "REQUEST_RETURN": "بإنتظار موافقة الإرجاع",
            "CONFIRM_FINISH_RETRNED": "تأكيد إنهاد الطلب المرتجع",
            "CREATE_RETURNED": "إنشاء طلب مرتجع",
            "CREATE_ORDER": "إنشاء الطلب",
            "A_NEW_RETURNED_ORDER": "!سيتم إنشاء طلب جديد (كطلب مرتجع) بنفس المعلومات",
        },
        HOME: {
            "MAIN_HEADER_TEXT": "هل انت صاحب عمل اوانت شخص يرغب في ايصال او استلام طلب ؟ ",
            "MAIN_HEADER_SUB_TEXT": "انت في المكان المناسب يا عزيزي باستخدامك لخدماتنا سوف يكون بامكانك ايجاد الناقل لايصال او تسليم طلبك",
            "DETAIL_ONE": "يامكاننا الوصول لاي مكان مهما بلغ حجم الطلب وباقل الرسوم",
            "DETAIL_TWO": "اطلب وتتبع طلبك",
            "DETAIL_THREE": "وفر وفتك باستخدامك تطبيقنا لان هناك المزيد",
            "DETAIL_FOUR": "عمليات بسطيه قم باختيار الطرق الملائمه لدفع والتسليم",
            "DETAIL_FIVE": "ارسل واستقبل طلبك على مدار الساعه",
        },
        ADMIN: {
            "CREATE_TEAM": "اضف فريق",
            "ADD_MEMBER": "اضف عضو الى الفريق",
            "TEAM_NAME": "اسم الفريق",
            "MANAGE": "اداره الفرق",
            "ENTER_TEAM_NAME": "ادخل اسم الفريق",
            "ENTER_MEMBER_NAME": "ادخل رقم الهاتف",
            "MOBILE_NUMBER": "رقم الهاتف",
            "STATUS": "الحاله",
            "MEMBER_NAME": "اسم العضو",
            "TRANSPORTER_NAME": "اسم الناقل",
            "DATE": "التاريخ",
            "DESC": "الوصف",
            "RECEIPT_FROM": "وصل قبض مبلغ من ناقل",
            "SAVE": "حفظ",
            "RECIPIENT_SIGH": "توقيع المستلم"
        },
        NAV: {
            "HOME": "الصفحة الرئيسه",
            "CONTACT_US": "تواصل معنا",
            "LOGIN": "تسجيل الدخول"
        },
        BUSINESS_LOCATION: {
            NAME: "الإسم",
            PLACE: "المكان",
            TYPE: "النوع",
            UPDATE: "تحديث"
        },
        WAYBILL: {
            TITLE: "قسيمة شحن",
            PRINT_DATE: "تاريخ الطباعه",
            SENDER: "معلومات المرسل",
            RECEIVER: "معلومات المستقبل",
            DELIVER_PRICE: "ثمن التوصيل",
            NIS: "شيكل",
            SHIP: "نوع الشحنة",
            LENGTH: "طول",
            WEIGHT: "وزن",
            WIDTH: "عرض",
            HEIGHT: "ارتفاع",
            CONTENTS: "المحتويات",
            NOTES: "الملاحظات",
            QR: "تتبّع وادفع",
            ORDER_ID:"رقم تتبع الطلب من TOGO",
            AMOUNT: "قيمه التحصيل",
            TERMS_AND_CONDITIONS: "شروط استخدام تطبيق TOGO:",
            CLOUSE_ONE: "اية خسائر ناتجة عن تاخير او خراب او ضياع للشحنة بسبب اختيار ناقل معين هي من مسوولية الناقل ولا تتحمل شركة TOGO اية مسوولية عن اختيار الناقل او اية خسائر اخرى ناتجة",
            CLOUSE_TWO: "قبول المرسل لخدمات الناقل هو اتفاق بين المرسل والناقل لارسال الشحنة",
            CLOUSE_THREE: "خدمة TOGO هي موقع لاستدراج العروض المناسبة للشحن ومتابعة مسار الشحنة لغاية وصول الشحنة الى هدفها النهائي",
            CLOUSE_FOUR: "استخدام الناقل لخدمات TOGO هي موافقة صريحه وواضحة لقبولك لشروط الاستخدام",
            CLOUSE_FIVE: "على المرسل اختيار الناقل المناسب",
            CLOUSE_SIX: "شركة TOGO لا تدعم ولا تشجع على استخدام ناقل معين",
            TERMS_AND_CONDITIONS_AR: "TOGO Application Terms & Conditions:",
            CLOUSE_ONE_AR: "TOGO Company is not responsible for any losses, delays or damages of the package, if the client choose a specific transporter then the transporter is the one responsible for that",
            CLOUSE_TWO_AR: "The client accepting the transporter offer represents an agreement between them for transferring the package",
            CLOUSE_THREE_AR: "TOGO Service has a mechanism for showing available offers and tracking the delivery process until it is arrive to the final destination",
            CLOUSE_FOUR_AR: "The Transporter using TOGO services is an approving acceptance from you to the usage terms",
            CLOUSE_FIVE_AR: "The Client should choose right transporter for the job",
            CLOUSE_SIX_AR: "TOGO Company does not recommend any specific transporter",
            LOAD_DETAILS: "تفاصيل الحمل",
        },
        NETWORK: {
            NETWORK_TITLE: "شبكتي",
            OTHER_NETWORK: "شبكات أخرى",
            MEMBER_ON_OTHER_NETWORKS: "عضو على شبكات أخرى",
            MY_CLIENTS: "عملائي المباشرين",
        }
    }
}