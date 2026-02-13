import type {
    Challenge,
    Notification,
    SwimLaneCard,
    User,
    ChallengeDetailData,
    Idea,
    ChallengeCardData,
    UserProfileData
} from '../types';
import { MOCK_CHALLENGE_DETAILS, MOCK_CHALLENGE_CARDS } from '../data/mocks/challengeMocks';
import { MOCK_NOTIFICATIONS } from '../data/mocks/notificationMocks';
import { MOCK_SWIMLANES } from '../data/mocks/swimlaneMocks';
import { MOCK_USERS } from '../data/mocks/userMocks';
import { MOCK_IDEA_DETAILS } from '../data/mocks/ideaMocks';
import { MOCK_USER_PROFILE } from '../data/mocks/profileMocks';

/**
 * Service to simulate backend API calls with retry and fallback logic.
 * @deprecated Use specific feature services (ChallengeService, IdeaService, etc.) and apiRequest instead.
 */
class ApiService {
    private readonly DELAY_MS = 500; // Simulate network latency

    /**
     * Generic fetch method with retry logic.
     * In a real app, this would use fetch() or axios.
     */
    private async fetchData<T>(data: T, shouldFail: boolean = false): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error("Simulated API Error"));
                } else {
                    resolve(data);
                }
            }, this.DELAY_MS);
        });
    }

    /**
     * Retry wrapper for API calls.
     */
    private async withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0) {
                console.warn(`API call failed. Retrying... (${retries} attempts left)`);
                await new Promise(res => setTimeout(res, delay));
                return this.withRetry(fn, retries - 1, delay);
            } else {
                console.error("API call failed after max retries.");
                throw error;
            }
        }
    }

    // ─── Public API Methods ──────────────────────────────────────────────

    /**
     * Fetches the list of all challenges.
     * @returns Promise<Challenge[]>
     */
    async getChallenges(): Promise<Challenge[]> {
        // Casting detail data to Challenge summary for legacy support
        return this.withRetry(() => this.fetchData(MOCK_CHALLENGE_DETAILS as unknown as Challenge[]));
    }

    /**
     * Fetches user notifications.
     * @returns Promise<Notification[]>
     */
    /**
     * Fetches user notifications.
     * @returns Promise<Notification[]>
     */
    async getNotifications(): Promise<Notification[]> {
        return this.withRetry(() => this.fetchData(MOCK_NOTIFICATIONS));
    }

    /**
     * Fetches swimlane data for the dashboard.
     * @returns Promise<SwimLaneCard[]>
     */
    async getSwimLanes(): Promise<SwimLaneCard[]> {
        return this.withRetry(() => this.fetchData(MOCK_SWIMLANES));
    }

    /**
     * Fetches all users.
     * @returns Promise<User[]>
     */
    async getUsers(): Promise<User[]> {
        return this.withRetry(() => this.fetchData(MOCK_USERS));
    }

    /**
     * Fetches detailed information for a specific challenge.
     * @param id Challenge ID
     * @returns Promise<ChallengeDetailData | undefined>
     */
    async getChallengeDetails(id: string): Promise<ChallengeDetailData | undefined> {
        return this.withRetry(async () => {
            const data = MOCK_CHALLENGE_DETAILS.find(c => c.id === id);
            // Fallback to first if not found for mock purposes, or return undefined
            return this.fetchData(data || MOCK_CHALLENGE_DETAILS[0]);
        });
    }

    /**
     * Fetches detailed information for a specific idea.
     * @param id Idea ID
     * @returns Promise<Idea | undefined>
     */
    async getIdeaDetails(id: string): Promise<Idea | undefined> {
        return this.withRetry(async () => {
            const data = MOCK_IDEA_DETAILS.find(i => i.id === id);
            return this.fetchData(data || MOCK_IDEA_DETAILS[0]);
        });
    }

    /**
     * Fetches dashboard challenge cards.
     * @returns Promise<ChallengeCardData[]>
     */
    async getChallengeCards(): Promise<ChallengeCardData[]> {
        return this.withRetry(() => this.fetchData(MOCK_CHALLENGE_CARDS));
    }

    /**
     * Fetches the current user's profile data including stats, contributions, and activity.
     * @returns Promise<UserProfileData>
     */
    async getUserProfileData(): Promise<UserProfileData> {
        return this.withRetry(() => this.fetchData(MOCK_USER_PROFILE));
    }

    // ─── Mutation Methods (Mock Implementation) ──────────────────────────

    // In a real app, these would POST/PUT to an endpoint.
    // Here we just simulate a successful operation.

    async currentUser(): Promise<User | null> {
        // Simulating getting the logged-in user (e.g., from session)
        // For now, return the first user (usually Admin or Ravi)
        return this.fetchData(MOCK_USERS[1]);
    }
}

export const apiService = new ApiService();
