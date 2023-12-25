import { Suspense, lazy } from 'react'

import { Route, Switch } from 'react-router-dom'

import HybridRoute from './HyBridRoute'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import { AdminLayout, CommonLayout } from '~/Layout'
import { ROLE_ACCESS } from '~/constants/conferenceRoles'
import Loading from '~/pages/Loading'
import NotFound from '~/pages/Notfound'

const publicRoutes = [
    {
        component: lazy(() => import('~/pages/Login')),
        path: '/login',
        name: 'login',
        layout: 'common',
    },
    {
        component: lazy(() => import('~/pages/Register')),
        path: '/register',
        name: 'register',
        layout: 'common',
    },
    {
        component: lazy(() => import('~/pages/VerifyEmail')),
        path: '/verify',
        name: 'verify',
        layout: 'common',
    },
    {
        component: lazy(() => import('~/pages/ConfirmEmail')),
        path: '/confirm-email',
        name: 'confirm email',
        layout: 'common',
    },
    {
        component: lazy(() => import('~/pages/SysDate')),
        path: '/sysdate',
        name: 'sysdate',
        layout: 'common',
    },
]

const hybridRoutes = [
    {
        component: lazy(() => import('~/pages/InviteConfirm')),
        path: '/accept-invitation',
        name: 'invite accept',
        layout: 'common',
    },
]

const privateRoutes = [
    {
        component: lazy(() => import('~/pages/Conferences')),
        path: '/conferences',
        name: 'conferences',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.ALL,
        },
    },
    {
        component: lazy(() => import('~/pages/SubmissionConfig')),
        path: '/conferences/:conferenceId/settings/submission',
        name: 'submission',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/SubjectAreaConfig')),
        path: '/conferences/:conferenceId/settings/subject-area',
        name: 'subject area',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/PaperStatusConfig')),
        path: '/conferences/:conferenceId/settings/paper-status',
        name: 'paper status',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/DeadlineConfig')),
        path: '/conferences/:conferenceId/settings/deadline',
        name: 'deadlines',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/SubmissionQuestionsConfig')),
        path: '/conferences/:conferenceId/settings/submission-question',
        name: 'submission',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/TrackConfig')),
        path: '/conferences/:conferenceId/settings/track',
        name: 'track config',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/CreatePaperSubmission')),
        path: '/conferences/:conferenceId/submission/:trackId/create-new-paper',
        name: 'create submission paper',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/ReviewConfig')),
        path: '/conferences/:conferenceId/settings/review',
        name: 'review config',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/ReviewerConsole')),
        path: '/conferences/:conferenceId/submission/reviewer',
        name: 'reviewer console',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/ManageConferenceUsers')),
        path: '/conferences/:conferenceId/manage-conference-users',
        name: 'manage-conference-users',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/EditReview')),
        path: '/conferences/:conferenceId/reviewer/:submissionId/edit-review',
        name: 'edit review',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/UploadRevision')),
        path: '/conferences/:conferenceId/submission/:submissionId/revision',
        name: 'upload revision',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/EditRevision')),
        path: '/conferences/:conferenceId/submission/:submissionId/edit-revision',
        name: 'upload revision',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/UploadPresentation')),
        path: '/conferences/:conferenceId/submission/:submissionId/presentation',
        name: 'upload presentation',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/EditPresentation')),
        path: '/conferences/:conferenceId/submission/:submissionId/edit-presentation',
        name: 'edit presentation',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/ReviewerSuggestionConfig')),
        path: '/conferences/:conferenceId/settings/reviewer-suggestion',
        name: 'reviewer suggestion',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/TrackChairConsole')),
        path: '/conferences/:conferenceId/submission/submission-console',
        name: 'track-chair',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/AuthorConsole')),
        path: '/conferences/:conferenceId/submission/author',
        name: 'author console',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/ReportConsole')),
        path: '/conferences/:conferenceId/assignment-report/:reviewerAccountId',
        name: 'report-console',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/DashboardConsole')),
        path: '/conferences/:conferenceId/dashboard-console/:id',
        name: 'dashboard-console',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/EmailHistory')),
        path: '/conferences/:conferenceId/email-history',
        name: 'email-history',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/InviteReviewer')),
        path: '/conferences/:conferenceId/invite-reviewer',
        name: 'invite-reviewer',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/ManageReviewerInvite')),
        path: '/conferences/:conferenceId/manage-reviewer-invite',
        name: 'manage-reviewer-invite',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    // {
    //     component: lazy(() => import('~/pages/ResendInvite')),
    //     path: '/conferences/:conferenceId/resend-invite',
    //     name: 'resend-invite',
    //     layout: 'common',
    //     roleAccess: {
    //         roleCommon: 'user',
    //         conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
    //     },
    // },
    {
        component: lazy(() => import('~/pages/EditQuota')),
        path: '/conferences/:conferenceId/my-reviewing/edit-quota/:trackId',
        name: 'edit-quota',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/ManageReviewers')),
        path: '/conferences/:conferenceId/manage-reviewers',
        name: 'manage-reviewers',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/SelectSubjectAreas')),
        path: '/conferences/:conferenceId/my-reviewing/select-subject',
        name: 'select-subject',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/EditConflictInterest')),
        path: '/conferences/:conferenceId/edit-conflict/:id',
        name: 'edit-conflict',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/UploadSupplementary')),
        path: '/conferences/:conferenceId/upload-supplementary/:submissionId',
        name: 'upload-supplement',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/SubmissionSummary')),
        path: '/conferences/:conferenceId/submission-summary/:submissionId',
        name: 'submission-summary',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },

    {
        component: lazy(() => import('~/pages/AuthorNotification')),
        path: '/conferences/:conferenceId/author-notification',
        name: 'author notification',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/MyQuotaTable')),
        path: '/conferences/:conferenceId/my-reviewing',
        name: 'author quota',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/ReviewerEditConflict')),
        path: '/conferences/:conferenceId/reviewer-conflict/:submissionId',
        name: 'reviewer edit conflict',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/ReviewerReviews')),
        path: '/conferences/:conferenceId/track/:trackId/paper/:submissionId/reviewer-reviews/:id',
        name: 'reviewer edit review',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/Registration')),
        path: '/conferences/:conferenceId/submission/author/registration',
        name: 'registration',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/RegistrationProof')),
        path: '/conferences/:conferenceId/submission/:userIdProof/payment-proof',
        name: 'registration proof',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/CameraReadySubmission')),
        path: '/conferences/:conferenceId/track/:trackId/paper/:submissionId/camera-ready',
        name: 'camera-ready',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/DraftCreateConference/Draft/Checkout')),
        path: '/conferences/:conferenceId/checkout',
        name: 'asd',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/DraftCreateConference/Draft/PaymentSuccess')),
        path: '/conferences/:conferenceId/checkout/:orderId/payment-success',
        name: 'payment success',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/DraftCreateConference/Draft/PaymentFail')),
        path: '/conferences/:conferenceId/checkout/payment-fail',
        name: 'payment fail',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/RedirectConferenceDetail')),
        path: '/conferences/redirect/:conferenceId',
        name: 'redirect conference',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.ALL,
        },
    },
    {
        component: lazy(() => import('~/pages/DraftCreateConference/Draft/SunTextEditor')),
        path: '/admin/:conferenceId/sun-text-editor',
        name: 'sun text editor',
        layout: 'admin',
        roleAccess: {
            roleCommon: 'admin',
            conferenceRole: ROLE_ACCESS.ADMIN,
        },
    },
    {
        component: lazy(() => import('~/pages/admin/Dashboard')),
        path: '/admin',
        name: 'dashboard',
        layout: 'admin',
        roleAccess: {
            roleCommon: 'admin',
            conferenceRole: ROLE_ACCESS.ADMIN,
        },
    },
    {
        component: lazy(() => import('~/pages/NewConference')),
        path: '/admin/create-conference',
        name: 'new conference',
        layout: 'admin',
        roleAccess: {
            roleCommon: 'admin',
            conferenceRole: ROLE_ACCESS.ADMIN,
        },
    },
    {
        component: lazy(() => import('~/pages/EditConference')),
        path: '/admin/edit-conference/:conferenceId',
        name: 'edit conference',
        layout: 'admin',
        roleAccess: {
            roleCommon: 'admin',
            conferenceRole: ROLE_ACCESS.ADMIN,
        },
    },
    {
        component: lazy(() => import('~/pages/admin/CreateWebSite')),
        path: '/admin/create-website/:conferenceId',
        name: 'create website',
        layout: 'admin',
        roleAccess: {
            roleCommon: 'admin',
            conferenceRole: ROLE_ACCESS.ADMIN,
        },
    },
    {
        component: lazy(() => import('~/pages/TrackPlanConfig')),
        path: '/conferences/:conferenceId/settings/track-plan',
        name: 'subject area',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/ConferenceDashboard')),
        path: '/conferences/:conferenceId/dashboard',
        name: 'conference dashboard',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/Profile/CreateGeneralProfile')),
        path: '/create-profile',
        name: 'home',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.ALL,
        },
    },
    {
        component: lazy(() => import('~/pages/Profile/ScientistProfile')),
        path: '/scientist-profile',
        name: 'user profile',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.ALL,
        },
    },
    {
        component: lazy(() => import('~/pages/UpdatePaperSubmission')),
        path: '/conferences/:conferenceId/submission/:trackId/update-paper-submission/:submissionId',
        name: 'update submission',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/Home')),
        path: '/',
        name: 'home',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.ALL,
        },
    },
    {
        component: lazy(() => import('~/pages/EditCameraReady')),
        path: '/conferences/:conferenceId/track/:trackId/paper/:submissionId/edit-camera-ready',
        name: 'edit-camera-ready',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/CameraReadyQuestionConfig')),
        path: '/conferences/:conferenceId/settings/camera-ready-submission',
        name: 'camera ready question',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/RegistrationSetting')),
        path: '/conferences/:conferenceId/settings/registration',
        name: 'registration',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/ViewReview')),
        path: '/conferences/:conferenceId/submission/:submissionId/review',
        name: 'track chair view review',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/ReviewerViewReview')),
        path: '/conferences/:conferenceId/submission/:submissionId/review/:reviewAssignmentId',
        name: 'reviewer view review',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.REVIEWER,
        },
    },
    {
        component: lazy(() => import('~/pages/AuthorViewReview')),
        path: '/conferences/:conferenceId/submission/:submissionId/paper-review',
        name: 'author view review',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/EditReview')),
        path: '/conferences/:conferenceId/track/:trackId/paper/:submissionId/edit-reviewer-reviews/:reviewAssignmentId',
        name: 'edit reviewer review',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR_AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/Manuscript')),
        path: '/conferences/:conferenceId/manuscript',
        name: 'manuscript',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/DecisionQuestionConfig')),
        path: '/conferences/:conferenceId/settings/decision-criteria-submission',
        name: 'decision criteria',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/PaperDecision')),
        path: '/conferences/:conferenceId/submission/:submissionId/decision',
        name: 'paper decision making',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/MyRegistration')),
        path: '/conferences/:conferenceId/my-registration',
        name: 'my registration',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/CameraReadyConfig')),
        path: '/conferences/:conferenceId/settings/camera-ready-submissions',
        name: 'camera ready settings',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/PresentationConfig')),
        path: '/conferences/:conferenceId/settings/presentations',
        name: 'presentations settings',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/RegistrationSummary')),
        path: '/conferences/:conferenceId/registration-summary',
        name: 'registration-summary',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.AUTHOR,
        },
    },
    {
        component: lazy(() => import('~/pages/WarningFactor')),
        path: '/conferences/:conferenceId/settings/warning-factor',
        name: 'warning factor',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/EmailTemplateConfig')),
        path: '/conferences/:conferenceId/settings/email-template',
        name: 'email template',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
    {
        component: lazy(() => import('~/pages/NotifySubmitPaper')),
        path: '/conferences/:conferenceId/notification-submission-paper',
        name: 'notify paper submission',
        layout: 'common',
        roleAccess: {
            roleCommon: 'user',
            conferenceRole: ROLE_ACCESS.TRACK_CHAIR,
        },
    },
]

const routes = (
    <Suspense fallback={<Loading />}>
        <Switch>
            <Route path="/admin">
                <AdminLayout>
                    <Suspense fallback={<Loading />}>
                        <Switch>
                            {publicRoutes.map(
                                ({ layout, ...route }) =>
                                    layout === 'admin' && <PublicRoute key={route.name} exact={true} {...route} />
                            )}
                            {hybridRoutes.map(
                                ({ layout, ...route }) =>
                                    layout === 'admin' && <HybridRoute key={route.name} exact={true} {...route} />
                            )}
                            {privateRoutes.map(
                                ({ layout, ...route }) =>
                                    layout === 'admin' && <PrivateRoute key={route.name} exact={true} {...route} />
                            )}
                            <Route path="*">
                                <NotFound />
                            </Route>
                        </Switch>
                    </Suspense>
                </AdminLayout>
            </Route>
            <Route>
                <CommonLayout>
                    <Suspense fallback={<Loading />}>
                        <Switch>
                            {publicRoutes.map(
                                ({ layout, ...route }) =>
                                    layout === 'common' && <PublicRoute key={route.name} exact={true} {...route} />
                            )}
                            {hybridRoutes.map(
                                ({ layout, ...route }) =>
                                    layout === 'common' && <HybridRoute key={route.name} exact={true} {...route} />
                            )}
                            {privateRoutes.map(
                                ({ layout, ...route }) =>
                                    layout === 'common' && <PrivateRoute key={route.name} exact={true} {...route} />
                            )}
                            <Route path="*">
                                <NotFound />
                            </Route>
                        </Switch>
                    </Suspense>
                </CommonLayout>
            </Route>
        </Switch>
    </Suspense>
)

export default routes
