import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './AppContext'
import { AppShell } from '../components/AppShell'
import { TodayPage } from '../pages/TodayPage'
import { GoalsPage } from '../pages/GoalsPage'
import { VisionPage } from '../pages/VisionPage'
import { EntriesPage } from '../pages/EntriesPage'
import { WeeklyReviewPage } from '../pages/WeeklyReviewPage'
import { CoachPage } from '../pages/CoachPage'
import { InsightsPage } from '../pages/InsightsPage'
import { SettingsPage } from '../pages/SettingsPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<TodayPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="vision" element={<VisionPage />} />
            <Route path="entries" element={<EntriesPage />} />
            <Route path="weekly" element={<WeeklyReviewPage />} />
            <Route path="coach" element={<CoachPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
