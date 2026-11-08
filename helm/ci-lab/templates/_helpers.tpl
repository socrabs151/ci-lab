{{- define "ci-lab.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ci-lab.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "ci-lab.labels" -}}
app.kubernetes.io/name: {{ include "ci-lab.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end -}}

{{- define "ci-lab.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ci-lab.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
