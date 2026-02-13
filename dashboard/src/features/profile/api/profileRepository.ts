import { apiRequest } from '../../../utils/apiRequest';
import { ApiError } from '../../../utils/ApiError';
import { USER_API_ENDPOINTS } from '../../../api/userApiEndpoints';
import { UserProfileDataSchema } from '../../../schemas/userSchemas';
import type { UserProfileData } from '../../../types/user';
import { MOCK_USER_PROFILE } from '../../../data/mocks/profileMocks';

// Config was deleted, assuming mock flag is handled elsewhere or temporarily removed/hardcoded for now
const ENABLE_MOCK = false;

export class ProfileRepository {
    public async getUserProfile(): Promise<UserProfileData> {
        // 1. Force Mock if Configured
        if (ENABLE_MOCK) {
            console.log('⚠️ Using Mock Data for Profile (Configured)');
            return this.getFallbackData();
        }

        try {
            // 2. Attempt API Call
            const { url, method } = USER_API_ENDPOINTS.getProfile;
            const response = await apiRequest<UserProfileData>({ url, method });

            // 3. Validation
            return UserProfileDataSchema.parse(response);
        } catch (error) {
            console.warn('⚠️ API Failed, attempting fallback:', error);

            // 4. Fallback Logic: If API fails (Network/500), load JSON
            if (error instanceof ApiError && (error.isNetworkError || error.status >= 500)) {
                return this.getFallbackData();
            }

            throw error;
        }
    }

    private getFallbackData(): UserProfileData {
        try {
            // Validate JSON Data against the same Schema
            return UserProfileDataSchema.parse(MOCK_USER_PROFILE);
        } catch (validationError) {
            console.error('❌ Fallback JSON validation failed:', validationError);
            throw new ApiError({
                message: 'Failed to load backup profile data',
                status: 500,
                code: 'FALLBACK_ERROR',
                userMessage: 'could not load profile data.',
                data: validationError
            });
        }
    }
}

export const profileRepository = new ProfileRepository();
