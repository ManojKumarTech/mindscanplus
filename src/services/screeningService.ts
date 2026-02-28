import {
    addDoc,
    collection,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../backend/firebase.ts';
import { formatDate, formatMonth } from '../utils/dateUtils';

export interface ScreeningResult {
    userId: string;
    stressScore: number;
    stressLevel: 'Low' | 'Moderate' | 'High';
    createdAt: any;
    id?: string;
}

/**
 * Save stress screening result to Firestore
 * Only stores final computed result, not individual questions
 * Saves to /users/{userId}/screeningResults collection
 */
export async function saveScreeningResult(
    userId: string,
    stressScore: number,
    stressLevel: 'Low' | 'Moderate' | 'High'
): Promise<string> {
    try {
        const docRef = await addDoc(
            collection(db, 'users', userId, 'screeningResults'),
            {
                stressScore,
                stressLevel,
                createdAt: serverTimestamp(),
            }
        );
        return docRef.id;
    } catch (error) {
        console.error('Error saving screening result:', error);
        throw error;
    }
}

/**
 * Fetch all screening results for a specific user
 * Fetches from /users/{userId}/screeningResults collection
 */


/**
 * Dashboard data structure for results
 */
export interface DayGroupedResult {
    date: string;
    results: ScreeningResult[];
    averageScore: number;
    counts: { Low: number; Moderate: number; High: number };
}

export interface MonthGroupedResult {
    month: string;
    results: ScreeningResult[];
    averageScore: number;
    counts: { Low: number; Moderate: number; High: number };
}

export interface DashboardMetrics {
    last7Days: DayGroupedResult[];
    currentMonth: MonthGroupedResult;
    overallAverageScore: number;
    totalResults: number;
}

/**
 * Process screening results for dashboard display
 * Groups by day (last 7 days) and by month (current month)
 * Calculates averages and level counts
 */
export function processDashboardMetrics(results: ScreeningResult[]): DashboardMetrics {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days before today = last 7 days

    const currentMonthStr = formatMonth(now);

    // Filter results for last 7 days
    const last7DaysResults = results.filter(r => {
        const resultDate = r.createdAt?.toDate?.() || new Date(r.createdAt);
        return resultDate >= sevenDaysAgo;
    });

    // Filter results for current month
    const currentMonthResults = results.filter(r => {
        const resultDate = r.createdAt?.toDate?.() || new Date(r.createdAt);
        return formatMonth(resultDate) === currentMonthStr;
    });

    // Group last 7 days by date
    const dayMap = new Map<string, ScreeningResult[]>();
    last7DaysResults.forEach(result => {
        const resultDate = result.createdAt?.toDate?.() || new Date(result.createdAt);
        const dateStr = formatDate(resultDate);
        if (!dayMap.has(dateStr)) {
            dayMap.set(dateStr, []);
        }
        dayMap.get(dateStr)!.push(result);
    });

    // Create 7-day range from sevenDaysAgo to now
    const last7Days: DayGroupedResult[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = formatDate(d);
        const dayResults = dayMap.get(dateStr) || [];

        const scores = dayResults.map(r => r.stressScore);
        const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        const counts = {
            Low: dayResults.filter(r => r.stressLevel === 'Low').length,
            Moderate: dayResults.filter(r => r.stressLevel === 'Moderate').length,
            High: dayResults.filter(r => r.stressLevel === 'High').length,
        };

        last7Days.push({
            date: dateStr,
            results: dayResults,
            averageScore: Math.round(averageScore * 10) / 10,
            counts,
        });
    }

    // Calculate current month metrics
    const monthScores = currentMonthResults.map(r => r.stressScore);
    const monthAverageScore =
        monthScores.length > 0 ? monthScores.reduce((a, b) => a + b, 0) / monthScores.length : 0;

    const monthCounts = {
        Low: currentMonthResults.filter(r => r.stressLevel === 'Low').length,
        Moderate: currentMonthResults.filter(r => r.stressLevel === 'Moderate').length,
        High: currentMonthResults.filter(r => r.stressLevel === 'High').length,
    };

    const currentMonth: MonthGroupedResult = {
        month: currentMonthStr,
        results: currentMonthResults,
        averageScore: Math.round(monthAverageScore * 10) / 10,
        counts: monthCounts,
    };

    // Calculate overall average
    const allScores = results.map(r => r.stressScore);
    const overallAverageScore =
        allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

    return {
        last7Days,
        currentMonth,
        overallAverageScore: Math.round(overallAverageScore * 10) / 10,
        totalResults: results.length,
    };
}
