import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile, Match } from "../types";

function calculateOverlapScore(arr1: string[] = [], arr2: string[] = []): number {
  if (!arr1 || !arr2 || (arr1.length === 0 && arr2.length === 0)) return 0;
  
  const set1 = new Set(arr1.map(s => s.toLowerCase().trim()));
  const set2 = new Set(arr2.map(s => s.toLowerCase().trim()));
  
  let intersectionCount = 0;
  for (const item of set1) {
    if (set2.has(item)) intersectionCount++;
  }
  
  const unionCount = new Set([...set1, ...set2]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

export async function findCompatibleMatches(currentUser: UserProfile): Promise<(Match & { matchedUser: UserProfile })[]> {
  if (!currentUser.id) return [];

  // Fetch all discoverable users
  const q = query(
    collection(db, "users"),
    where("is_discoverable", "==", true)
  );
  
  const querySnapshot = await getDocs(q);
  const allUsers: UserProfile[] = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
    .filter(u => u.id !== currentUser.id);

  const scoredMatches = allUsers.map(targetUser => {
    // 1. Skills (30%)
    const skillScore = calculateOverlapScore(currentUser.skills, targetUser.skills);
    
    // 2. Interests (25%)
    const interestScore = calculateOverlapScore(currentUser.interests, targetUser.interests);
    
    // 3. Goals / Looking For (20%)
    const goalScore = calculateOverlapScore(currentUser.looking_for, targetUser.looking_for);
    
    // 4. Experience Level (15%)
    let expScore = 0;
    const expLevels = ['Student', 'Fresher', 'Professional', 'Founder', 'Senior Professional'];
    const myExpIdx = expLevels.indexOf(currentUser.experience_level || '');
    const theirExpIdx = expLevels.indexOf(targetUser.experience_level || '');
    if (myExpIdx !== -1 && theirExpIdx !== -1) {
      const diff = Math.abs(myExpIdx - theirExpIdx);
      if (diff === 0) expScore = 1.0;
      else if (diff === 1) expScore = 0.5;
    } else if (currentUser.experience_level === targetUser.experience_level) {
      expScore = 1.0;
    }

    // 5. Location (10%)
    let locScore = 0;
    if (currentUser.city && targetUser.city && currentUser.city.toLowerCase() === targetUser.city.toLowerCase()) {
      locScore += 0.7;
    }
    if (currentUser.country && targetUser.country && currentUser.country.toLowerCase() === targetUser.country.toLowerCase()) {
      locScore += 0.3;
    }

    const totalScore = (
      (skillScore * 30) +
      (interestScore * 25) +
      (goalScore * 20) +
      (expScore * 15) +
      (locScore * 10)
    );

    const common_skills = (currentUser.skills || []).filter(s => 
      (targetUser.skills || []).map(x => x.toLowerCase()).includes(s.toLowerCase())
    );
    const common_interests = (currentUser.interests || []).filter(i => 
      (targetUser.interests || []).map(x => x.toLowerCase()).includes(i.toLowerCase())
    );

    return {
      matchDoc: {
        id: '', // Will be assigned on save
        user_ids: [currentUser.id as string, targetUser.id as string],
        compatibility_score: Math.round(totalScore),
        common_skills,
        common_interests,
        status: 'pending' as const,
        icebreaker: `You both share an interest in ${common_interests[0] || 'tech'} and have skills in ${common_skills[0] || 'software'}.`,
        created_at: new Date()
      },
      matchedUser: targetUser
    };
  });

  scoredMatches.sort((a, b) => b.matchDoc.compatibility_score - a.matchDoc.compatibility_score);
  const topMatches = scoredMatches.slice(0, 5);

  // Save them to firestore
  const finalMatches = [];
  for (const item of topMatches) {
    if (item.matchDoc.compatibility_score > 0) {
      const docRef = await addDoc(collection(db, "matches"), item.matchDoc);
      item.matchDoc.id = docRef.id;
      finalMatches.push({
        ...item.matchDoc,
        matchedUser: item.matchedUser
      });
    }
  }

  return finalMatches;
}
