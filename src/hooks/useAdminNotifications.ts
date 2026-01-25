import { useEffect, useRef } from 'react';

export function useAdminNotifications(newMessagesCount: number, newResponsesCount: number) {
  const prevNewMessagesCount = useRef(newMessagesCount);
  const prevNewResponsesCount = useRef(newResponsesCount);

  useEffect(() => {
    const soundEnabled = localStorage.getItem('admin_sound_notifications') === 'true';
    
    if (soundEnabled) {
      if (newMessagesCount > prevNewMessagesCount.current) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eeeSwwMUKXh8LhjHAY4kte8zHksBSR3x/DdkEAKFF606OunVxILRp/g8r5sIQUrg87y2Yg2CBlou+3mnkwMDFCl4fC4YxwGOJLXvMx5LAUkd8fw3ZBAChRctOjrp1cSC0af4PK+ayEFK4PO8tmINgga6bvt555MEAxQpd/wuGMcBjiS17zMeSwFJHfH8N2QQAoUXLTo66dXEgtGn+Dyvmwfbyq==');
        audio.play().catch(() => {});
      }
      
      if (newResponsesCount > prevNewResponsesCount.current) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eeeSwwMUKXh8LhjHAY4kte8zHksBSR3x/DdkEAKFF606OunVxILRp/g8r5sIQUrg87y2Yg2CBlou+3mnkwMDFCl4fC4YxwGOJLXvMx5LAUkd8fw3ZBAChRctOjrp1cSC0af4PK+ayEFK4PO8tmINgga6bvt555MEAxQpd/wuGMcBjiS17zMeSwFJHfH8N2QQAoUXLTo66dXEgtGn+Dyvmwfbyq==');
        audio.play().catch(() => {});
      }
    }
    
    prevNewMessagesCount.current = newMessagesCount;
    prevNewResponsesCount.current = newResponsesCount;
  }, [newMessagesCount, newResponsesCount]);
}
