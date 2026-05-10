const ProfilePage = () => {
  return (
    <div className="max-w-md mx-auto py-32">
      <div className="flex flex-col items-center mb-32">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-16">
          <span className="text-secondary text-2xl font-bold">י</span>
        </div>
        <h1 className="text-2xl font-bold">ישראל ישראלי</h1>
        <p className="text-gray-500 text-sm">חבר מאז 2023</p>
      </div>
      
      <div className="space-y-16">
        <div className="card flex justify-between items-center">
          <span className="font-medium">ההשאלות שלי</span>
          <span className="text-secondary font-bold">2 פריטים</span>
        </div>
        <div className="card flex justify-between items-center">
          <span className="font-medium">ההזמנות שלי</span>
          <span className="text-secondary font-bold">0 פריטים</span>
        </div>
        <div className="card">הגדרות חשבון</div>
        <button className="w-full py-16 text-red-600 font-bold">התנתק</button>
      </div>
    </div>
  );
};

export default ProfilePage;
