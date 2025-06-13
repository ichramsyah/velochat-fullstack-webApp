// src/pages/ChatPage.jsx

erflow-hidden">
        {/* 3. Teruskan 'socket' dari state ke komponen anak */}
        {userInfo && <MyChats />}
        {userInfo && <ChatBox socket={socket} />}
      </div>
    </div>
  );
};

export default ChatPage;
