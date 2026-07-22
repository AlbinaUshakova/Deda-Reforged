'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/appStore';
import { COURSES, type CourseId } from '@/lib/courses';

const courseFlag: Record<CourseId, string> = {
  ka: '🇬🇪',
  sr: '🇷🇸',
};

export function LandingCourseTitle() {
  const courseId = useAppStore(state => state.settings.courseId);
  const hydrate = useAppStore(state => state.hydrate);
  const updateSettings = useAppStore(state => state.updateSettings);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      Учимся читать{' '}
      <br />
      <span className="inline-flex items-center gap-2 align-middle">
        <span>по</span>
        <span className="landing-course-flags" aria-label="Выбрать язык курса">
          {Object.values(COURSES).map(course => (
            <button
              key={course.id}
              type="button"
              className={`landing-course-flag ${courseId === course.id ? 'landing-course-flag--active' : ''}`}
              onClick={() => updateSettings({ courseId: course.id })}
              aria-label={`Выбрать ${course.title}`}
              aria-pressed={courseId === course.id}
              title={course.title}
            >
              <span aria-hidden="true">{courseFlag[course.id]}</span>
            </button>
          ))}
        </span>
        <span>играя</span>
      </span>
    </>
  );
}

export function LandingAlphabetTitle() {
  const courseId = useAppStore(state => state.settings.courseId);
  const hydrate = useAppStore(state => state.hydrate);
  const course = COURSES[courseId];

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{course.title}: {course.alphabetTitle}</>;
}
