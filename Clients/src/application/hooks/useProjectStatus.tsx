import { useEffect, useState } from "react";
import { getEntityById } from "../repository/entity.repository";

/**
 * Represents the status of a project, including assessments and controls.
 *
 * @interface ProjectStatus
 * @property {Assessments} assessments - The assessments associated with the project.
 * @property {Controls} controls - The controls associated with the project.
 */

export interface AssessmentsProject {
  projectId: number;
  totalAssessments: number;
  doneAssessments: number;
}

export interface ControlsProject {
  projectId: number;
  totalSubControls: number;
  doneSubControls: number;
}

export interface Assessments {
  percentageComplete: number;
  allDoneAssessments: number;
  allTotalAssessments: number;
  projects: AssessmentsProject[];
}

export interface Controls {
  percentageComplete: number;
  allDoneSubControls: number;
  allTotalSubControls: number;
  projects: ControlsProject[];
}

export interface MetricSectionProps {
  title: string;
  metricType?: "compliance" | "risk";
  assessments: Assessments;
  controls: Controls;
}

interface ProjectStatus {
  assessments: Assessments;
  controls: Controls;
}

const defaultControlsProject: ControlsProject = {
  projectId: 1,
  totalSubControls: 1,
  doneSubControls: 0,
};

const defaultAssessmentsProject: AssessmentsProject = {
  projectId: 1,
  totalAssessments: 1,
  doneAssessments: 0,
};

const defaultProjectStatus: ProjectStatus = {
  assessments: {
    percentageComplete: 0,
    allDoneAssessments: 0,
    projects: [defaultAssessmentsProject],
    allTotalAssessments: 0,
  },
  controls: {
    percentageComplete: 0,
    allDoneSubControls: 0,
    allTotalSubControls: 0,
    projects: [defaultControlsProject],
  },
};

const useProjectStatus = ({ userId }: { userId: string }) => {
  const [projectStatus, setProjectStatus] =
    useState<ProjectStatus>(defaultProjectStatus);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const fetchProjectStatus = async () => {
      try {
        const response = await getEntityById({
          routeUrl: `/users/${userId}/calculate-progress`,
          signal: controller.signal,
        });

        setProjectStatus({
          assessments: {
            percentageComplete:
              (response.allDoneAssessments / response.allTotalAssessments) *
              100,
            allDoneAssessments: response.allDoneAssessments,
            allTotalAssessments: response.allTotalAssessments,
            projects: response.assessmentsMetadata,
          },
          controls: {
            percentageComplete:
              (response.allDoneSubControls / response.allTotalSubControls) *
              100,
            allDoneSubControls: response.allDoneSubControls,
            allTotalSubControls: response.allTotalSubControls,
            projects: response.controlsMetadata,
          },
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProjectStatus();

    return () => controller.abort();
  }, [userId]);

  return {
    projectStatus: projectStatus ?? defaultProjectStatus,
    loading,
    error,
  };
};

export default useProjectStatus;
